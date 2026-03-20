## Creado por: Camilo Martinez
## Fecha: 19/03/2026
## Version: 1.0
"""Aplicación Flask para la Pizzería Pro.

Este módulo expone la API REST para gestionar pizzas y pedidos.
Incluye manejo de CORS para permitir peticiones desde el frontend Angular.

Typical usage example::

    python backend/app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

# Crear la aplicación Flask
app = Flask(__name__)

# Habilitar CORS para permitir peticiones desde el frontend Angular
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4200", "http://127.0.0.1:4200"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


@app.route('/api/pizzas', methods=['GET'])
def obtener_pizzas():
    """Endpoint para obtener la lista de pizzas disponibles.
    
    Returns:
        JSON con la lista de pizzas en el siguiente formato:
        {
            "pizzas": [
                {
                    "id": 1,
                    "nombre": "Hawaiana",
                    "descripcion": "Salsa de tomate, queso mozzarella, jamón y piña",
                    "precioBase": 25000,
                    "imagen": "/images/hawaina.png",
                    "activo": true
                },
                ...
            ]
        }
    """
    pizzas = [
        {
            "id": 1,
            "nombre": "Hawaiana",
            "descripcion": "Salsa de tomate, queso mozzarella, jamón y piña",
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
            "descripcion": "Salsa de tomate, queso mozzarella, champiñones, pimientos y cebolla",
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
    """Endpoint para recibir un pedido desde el frontend Angular.

    Recibe un JSON con la lista de pizzas del pedido y lo imprime
    en la consola del servidor.

    Returns:
        JSON con confirmación del pedido recibido.
    """
    datos: dict = request.get_json()
    pizzas_pedido: list = datos.get('pizzas', [])
    total: float = datos.get('total', 0)

    print("\n===== NUEVO PEDIDO RECIBIDO =====")
    for i, pizza in enumerate(pizzas_pedido, 1):
        print(f"  {i}. {pizza.get('nombre')} - ${pizza.get('precioBase'):,}")
    print(f"  TOTAL (con IVA): ${total:,.0f}")
    print("=================================\n")

    return jsonify({"status": "ok", "mensaje": "Pedido recibido correctamente"}), 201



def health_check():
    """Endpoint de health check para verificar que el backend está operativo.
    
    Returns:
        JSON con estado del backend
    """
    return jsonify({"status": "ok", "service": "Pizzería Pro API"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)