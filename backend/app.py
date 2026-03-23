## Creado por: Camilo Martinez
## Fecha: 23/03/2026
## Version: 4.1
"""Aplicación Flask para la Pizzería Pro.

API REST con persistencia en SQLite via Flask-SQLAlchemy y autenticación JWT.
"""

import os
import jwt as pyjwt
from datetime import datetime, timedelta, timezone
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from database import db, Pedido, ItemPedido, Usuario

# Ruta absoluta de la base de datos SQLite
RUTA_DB: str = os.path.join(os.path.dirname(__file__), 'pizzeria.db')

# Clave secreta para firmar los JWT
JWT_SECRET: str = os.environ.get('JWT_SECRET', 'pizzeria-pro-secret-key-2026')
JWT_EXPIRACION_HORAS: int = 24

# Crear la aplicación Flask
app: Flask = Flask(__name__)

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{RUTA_DB}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy con la app
db.init_app(app)

# Habilitar CORS
CORS(app, resources={r"/*": {
    "origins": "*",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

@app.after_request
def agregar_headers_cors(respuesta: Response) -> Response:
    """Inyecta los headers necesarios para evitar errores de CORS."""
    respuesta.headers["Access-Control-Allow-Origin"] = "*"
    respuesta.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    respuesta.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return respuesta

# Inicialización de base de datos y usuario maestro
with app.app_context():
    db.create_all()
    print(f"[INFO] Base de datos lista: {RUTA_DB}")

    if not Usuario.query.filter_by(email='admin@pizzeria.com').first():
        admin: Usuario = Usuario(
            nombre='Administrador',
            email='admin@pizzeria.com',
            contrasena_hash=generate_password_hash('admin1'),
            rol='admin'
        )
        db.session.add(admin)
        db.session.commit()
        print("[INFO] Usuario admin creado: admin@pizzeria.com")


@app.route('/api/auth/registro', methods=['POST'])
def registro() -> tuple[Response, int]:
    """Registra un nuevo usuario con tipado fuerte y validaciones."""
    datos: dict = request.get_json()
    nombre: str = str(datos.get('nombre', '')).strip()
    email: str = str(datos.get('email', '')).strip().lower()
    contrasena: str = str(datos.get('contrasena', ''))

    if not nombre or not email or not contrasena:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400
    
    if len(contrasena) < 6:
        return jsonify({"error": "La contrasena debe tener al menos 6 caracteres"}), 400

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"error": "El email ya esta registrado"}), 409

    nuevo_usuario: Usuario = Usuario(
        nombre=nombre,
        email=email,
        contrasena_hash=generate_password_hash(contrasena),
        rol='cliente'
    )
    db.session.add(nuevo_usuario)
    db.session.commit()

    token: str = _generar_token(nuevo_usuario)
    return jsonify({
        "access_token": token,
        "usuario": nuevo_usuario.serializar()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login() -> tuple[Response, int]:
    """Autentica al usuario devolviendo un token JWT."""
    datos: dict = request.get_json()
    email: str = str(datos.get('email', '')).strip().lower()
    contrasena: str = str(datos.get('contrasena', ''))

    usuario: Usuario | None = Usuario.query.filter_by(email=email).first()

    if not usuario or not check_password_hash(usuario.contrasena_hash, contrasena):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    token: str = _generar_token(usuario)
    return jsonify({
        "access_token": token,
        "usuario": usuario.serializar()
    }), 200


def _generar_token(usuario: Usuario) -> str:
    """Genera el token de acceso con expiración de 24 horas."""
    carga_util: dict = {
        "sub": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRACION_HORAS)
    }
    return pyjwt.encode(carga_util, JWT_SECRET, algorithm="HS256")


@app.route('/api/pizzas', methods=['GET'])
def obtener_pizzas() -> Response:
    """Devuelve el catálogo completo de productos disponibles."""
    lista_pizzas: list[dict] = [
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
    return jsonify({"pizzas": lista_pizzas})


@app.route('/api/pedidos', methods=['POST'])
def recibir_pedido() -> tuple[Response, int]:
    """Procesa y guarda un nuevo pedido de pizza."""
    datos: dict = request.get_json()
    articulos_recibidos: list = datos.get('items', [])
    total_recibido: float = float(datos.get('total', 0))

    subtotal: float = round(total_recibido / 1.19, 2)
    iva: float = round(total_recibido - subtotal, 2)

    nuevo_pedido: Pedido = Pedido(subtotal=subtotal, iva=iva, total=total_recibido)
    db.session.add(nuevo_pedido)
    db.session.flush()

    for item in articulos_recibidos:
        nuevo_item: ItemPedido = ItemPedido(
            pedido_id=nuevo_pedido.id,
            nombre=str(item.get('nombre', '')),
            tamano=str(item.get('tamano', '')),
            cantidad=int(item.get('cantidad', 1)),
            precio=float(item.get('precio', 0))
        )
        db.session.add(nuevo_item)

    db.session.commit()
    return jsonify({"status": "ok", "id_pedido": nuevo_pedido.id}), 201


@app.route('/api/pedidos', methods=['GET'])
def listar_pedidos() -> Response:
    """Lista todos los pedidos para el panel administrativo."""
    pedidos_db: list[Pedido] = Pedido.query.order_by(Pedido.id.desc()).all()
    return jsonify({
        "pedidos": [p.serializar() for p in pedidos_db],
        "total_pedidos": len(pedidos_db)
    })


@app.route('/api/health', methods=['GET'])
def estado_servidor() -> Response:
    """Verifica la salud del backend."""
    return jsonify({"status": "ok", "service": "Pizzeria Pro API"})


if __name__ == '__main__':
    puerto_servidor: int = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=puerto_servidor, debug=True)