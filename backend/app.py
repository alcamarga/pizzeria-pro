## Creado por: Camilo Martinez
## Fecha: 21/03/2026
## Version: 4.0
"""Aplicación Flask para la Pizzería Pro.

API REST con persistencia en SQLite via Flask-SQLAlchemy y autenticación JWT.
La base de datos se guarda en backend/pizzeria.db.

Typical usage example::

    python backend/app.py
"""

import os
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import db, Pedido, ItemPedido, Usuario

# Ruta absoluta de la base de datos SQLite
RUTA_DB: str = os.path.join(os.path.dirname(__file__), 'pizzeria.db')

# Clave secreta para firmar los JWT (en producción usar variable de entorno)
JWT_SECRET: str = os.environ.get('JWT_SECRET', 'pizzeria-pro-secret-key-2026')
JWT_EXPIRACION_HORAS: int = 24

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
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Crear tablas automáticamente si no existen y seed del usuario admin
with app.app_context():
    db.create_all()
    print(f"[INFO] Base de datos lista: {RUTA_DB}")

    # Crear usuario admin por defecto si no existe
    if not Usuario.query.filter_by(email='admin@pizzeria.com').first():
        admin: Usuario = Usuario(
            nombre='Administrador',
            email='admin@pizzeria.com',
            contrasena_hash=generate_password_hash('admin1'),
            rol='admin'
        )
        db.session.add(admin)
        db.session.commit()
        print("[INFO] Usuario admin creado: admin@pizzeria.com / admin1")


@app.route('/api/auth/registro', methods=['POST'])
def registro():
    """Registra un nuevo usuario con contraseña encriptada.

    Returns:
        JSON con access_token, refresh_token y datos del usuario (HTTP 201).
        JSON con error si el email ya existe (HTTP 409).
    """
    datos: dict = request.get_json()
    nombre: str = str(datos.get('nombre', '')).strip()
    email: str = str(datos.get('email', '')).strip().lower()
    contrasena: str = str(datos.get('contrasena', ''))

    # Validaciones básicas
    if not nombre or not email or not contrasena:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    if len(contrasena) < 6:
        return jsonify({"error": "La contrasena debe tener al menos 6 caracteres"}), 400

    # Verificar que el email no esté registrado
    if Usuario.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya esta registrado"}), 409

    # Crear usuario con hash de contraseña
    nuevo_usuario: Usuario = Usuario(
        nombre=nombre,
        email=email,
        contrasena_hash=generate_password_hash(contrasena),
        rol='cliente'
    )
    db.session.add(nuevo_usuario)
    db.session.commit()

    token: str = _generar_token(nuevo_usuario)
    print(f"[AUTH] Nuevo usuario registrado: {email}")

    return jsonify({
        "access_token": token,
        "refresh_token": token,
        "usuario": nuevo_usuario.serializar()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Autentica un usuario y devuelve un JWT si las credenciales son correctas.

    Returns:
        JSON con access_token, refresh_token y datos del usuario (HTTP 200).
        JSON con error si las credenciales son incorrectas (HTTP 401).
    """
    datos: dict = request.get_json()
    email: str = str(datos.get('email', '')).strip().lower()
    contrasena: str = str(datos.get('contrasena', ''))

    usuario: Usuario | None = Usuario.query.filter_by(email=email).first()

    # Verificar existencia y contraseña
    if not usuario or not check_password_hash(usuario.contrasena_hash, contrasena):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    token: str = _generar_token(usuario)
    print(f"[AUTH] Login exitoso: {email}")

    return jsonify({
        "access_token": token,
        "refresh_token": token,
        "usuario": usuario.serializar()
    }), 200


def _generar_token(usuario: Usuario) -> str:
    """Genera un JWT firmado con los datos del usuario.

    Args:
        usuario: Instancia del modelo Usuario autenticado.

    Returns:
        Token JWT como string.
    """
    payload: dict = {
        "sub": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRACION_HORAS)
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm="HS256")


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
