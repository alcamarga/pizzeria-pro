## Creado por: Camilo Martinez
## Fecha: 19/03/2026
## Version: 3.0
"""Aplicación Flask para la Pizzería Pro.

API REST con persistencia en SQLite via Flask-SQLAlchemy.
La base de datos se guarda en backend/pizzeria.db.

Typical usage example::

    python backend/app.py
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db, Pedido, ItemPedido

# Ruta absoluta de la base de datos SQLite
RUTA_DB: str = os.path.join(os.path.dirname(__file__), 'pizzeria.db')

# Crear la aplicación Flask
app: Flask = Flask(__name__)

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{RUTA_DB}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy con la app
db.init_app(app)

# Habilitar CORS para el frontend Angular
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Crear tablas automáticamente si no existen
with app.app_context():
    db.create_all()
    print(f"[INFO] Base de datos lista: {RUTA_DB}")


@app.route('/api/pizzas', methods=['GET'])
def obtener_pizzas():
    """Endpoint para obtener la lista de pizzas disponibles.

    Returns:
        JSON con la lista de pizzas y sus variantes de precio.
    """
    pizzas: list = [
        {
            "id": 1,
            "nombre": "Hawaiana",
            "descripcion": "Salsa de tomate, queso mozzarella, jamon y pina",
            "variantes": [
                {"tamano": "Personal", "precio": 20000},
                {"tamano": "Mediana",  "precio": 25000},
                {"tamano": "Familiar", "precio": 32500}
            ],
            "imagen": "/images/hawaina.png",
            "activo": True
        },
        {
            "id": 2,
            "nombre": "Pepperoni",
            "descripcion": "Salsa de tomate, queso mozzarella y pepperoni",
            "variantes": [
                {"tamano": "Personal", "precio": 22000},
                {"tamano": "Mediana",  "precio": 28000},
                {"tamano": "Familiar", "precio": 36400}
            ],
            "imagen": "/images/pepperoni.png",
            "activo": True
        },
        {
            "id": 3,
            "nombre": "Vegetariana",
            "descripcion": "Salsa de tomate, queso mozzarella, champinones, pimientos y cebolla",
            "variantes": [
                {"tamano": "Personal", "precio": 21000},
                {"tamano": "Mediana",  "precio": 27000},
                {"tamano": "Familiar", "precio": 35100}
            ],
            "imagen": "/images/vegetariana.png",
            "activo": True
        }
    ]
    return jsonify({"pizzas": pizzas})


@app.route('/api/pedidos', methods=['POST'])
def recibir_pedido():
    """Recibe un pedido del frontend y lo persiste en SQLite.

    Calcula subtotal e IVA, crea el registro Pedido con sus ItemPedido
    y los guarda en la base de datos.

    Returns:
        JSON con confirmación e ID del pedido guardado (HTTP 201).
    """
    datos: dict = request.get_json()
    items_recibidos: list = datos.get('items', [])
    total_recibido: float = float(datos.get('total', 0))

    # Calcular subtotal e IVA
    subtotal: float = round(total_recibido / 1.19, 2)
    iva: float = round(total_recibido - subtotal, 2)
    total: float = round(total_recibido, 2)

    # Crear el pedido en la base de datos
    nuevo_pedido: Pedido = Pedido(subtotal=subtotal, iva=iva, total=total)
    db.session.add(nuevo_pedido)
    db.session.flush()  # Obtener el ID antes del commit

    # Crear los items del pedido
    for item in items_recibidos:
        nuevo_item: ItemPedido = ItemPedido(
            pedido_id=nuevo_pedido.id,
            nombre=str(item.get('nombre', '')),
            tamano=str(item.get('tamano', '')),
            cantidad=int(item.get('cantidad', 1)),
            precio=float(item.get('precio', 0))
        )
        db.session.add(nuevo_item)

    db.session.commit()

    # Log en consola del servidor
    print(f"\n===== PEDIDO #{nuevo_pedido.id} GUARDADO — {nuevo_pedido.fecha_hora} =====")
    for item in items_recibidos:
        nombre: str = item.get('nombre', 'N/A')
        tamano: str = item.get('tamano', 'N/A')
        cantidad: int = item.get('cantidad', 1)
        precio: float = item.get('precio', 0)
        print(f"  - {nombre} ({tamano}) x{cantidad} = ${precio * cantidad:,.0f}")
    print(f"  Subtotal: ${subtotal:,.0f} | IVA: ${iva:,.0f} | Total: ${total:,.0f}")
    print("=" * 50)

    return jsonify({
        "status": "ok",
        "mensaje": "Pedido guardado en la base de datos",
        "id_pedido": nuevo_pedido.id
    }), 201


@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos():
    """Consulta todos los pedidos guardados en la base de datos.

    Returns:
        JSON con la lista completa de pedidos ordenados por fecha descendente.
    """
    pedidos: list[Pedido] = Pedido.query.order_by(Pedido.id.desc()).all()
    return jsonify({
        "pedidos": [p.serializar() for p in pedidos],
        "total_pedidos": len(pedidos)
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check del servidor.

    Returns:
        JSON con estado del backend y ruta de la base de datos.
    """
    return jsonify({
        "status": "ok",
        "service": "Pizzeria Pro API",
        "database": RUTA_DB
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
