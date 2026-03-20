## Creado por: Camilo Martinez
## Fecha: 20/03/2026
## Version: 1.0
"""Modelos SQLAlchemy para la base de datos de Pizzería Pro.

Define las tablas Pedido e ItemPedido con su relación uno-a-muchos.
La base de datos se guarda en backend/pizzeria.db (SQLite).
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Instancia compartida de SQLAlchemy
db: SQLAlchemy = SQLAlchemy()


class Pedido(db.Model):
    """Modelo de la tabla pedidos.

    Attributes:
        id: Identificador único autoincremental
        fecha_hora: Fecha y hora de creación del pedido
        subtotal: Monto sin IVA
        iva: IVA calculado (19%)
        total: Monto total con IVA
        items: Relación con los items del pedido
    """
    __tablename__ = 'pedidos'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha_hora: str = db.Column(db.String(20), nullable=False,
                                default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    subtotal: float = db.Column(db.Float, nullable=False, default=0.0)
    iva: float = db.Column(db.Float, nullable=False, default=0.0)
    total: float = db.Column(db.Float, nullable=False, default=0.0)

    # Relación uno-a-muchos con ItemPedido
    items = db.relationship('ItemPedido', backref='pedido',
                            lazy=True, cascade='all, delete-orphan')

    def serializar(self) -> dict:
        """Convierte el pedido a diccionario para respuesta JSON."""
        return {
            'id': self.id,
            'fecha_hora': self.fecha_hora,
            'items': [item.serializar() for item in self.items],
            'subtotal': round(self.subtotal, 2),
            'iva': round(self.iva, 2),
            'total': round(self.total, 2)
        }


class ItemPedido(db.Model):
    """Modelo de la tabla items_pedido.

    Attributes:
        id: Identificador único autoincremental
        pedido_id: Clave foránea al pedido padre
        nombre: Nombre de la pizza
        tamano: Tamaño seleccionado
        cantidad: Cantidad de unidades
        precio: Precio unitario al momento del pedido
    """
    __tablename__ = 'items_pedido'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pedido_id: int = db.Column(db.Integer, db.ForeignKey('pedidos.id'), nullable=False)
    nombre: str = db.Column(db.String(100), nullable=False)
    tamano: str = db.Column(db.String(50), nullable=False)
    cantidad: int = db.Column(db.Integer, nullable=False, default=1)
    precio: float = db.Column(db.Float, nullable=False, default=0.0)

    def serializar(self) -> dict:
        """Convierte el item a diccionario para respuesta JSON."""
        return {
            'nombre': self.nombre,
            'tamano': self.tamano,
            'cantidad': self.cantidad,
            'precio': self.precio
        }
