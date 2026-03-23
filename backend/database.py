## Creado por: Camilo Martinez
## Fecha: 23/03/2026
## Version: 4.1
"""Modelos SQLAlchemy para la base de datos de Pizzería Pro.

Define las tablas usuarios, pedidos e items_pedido.
Uso de Tipado Fuerte y nomenclatura en ESPAÑOL según Estándares Base.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from typing import Dict, List, Any

# Instancia compartida de SQLAlchemy
db: SQLAlchemy = SQLAlchemy()


class Usuario(db.Model):
    """Modelo de la tabla usuarios para gestión de accesos y roles."""
    
    __tablename__: str = 'usuarios'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre: str = db.Column(db.String(100), nullable=False)
    email: str = db.Column(db.String(150), unique=True, nullable=False)
    contrasena_hash: str = db.Column(db.String(256), nullable=False)
    rol: str = db.Column(db.String(20), nullable=False, default='cliente')
    fecha_registro: str = db.Column(
        db.String(20), 
        nullable=False,
        default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )

    def serializar(self) -> Dict[str, Any]:
        """Convierte la instancia de usuario a un diccionario para respuestas JSON."""
        return {
            'id': self.id,
            'nombre': self.nombre,
            'email': self.email,
            'rol': self.rol,
            'fecha_registro': self.fecha_registro
        }


class Pedido(db.Model):
    """Modelo de la tabla pedidos para registrar transacciones de venta."""
    
    __tablename__: str = 'pedidos'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    fecha_hora: str = db.Column(
        db.String(20), 
        nullable=False,
        default=lambda: datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    )
    subtotal: float = db.Column(db.Float, nullable=False, default=0.0)
    iva: float = db.Column(db.Float, nullable=False, default=0.0)
    total: float = db.Column(db.Float, nullable=False, default=0.0)

    # Relación uno-a-muchos con ItemPedido
    articulos = db.relationship(
        'ItemPedido', 
        backref='pedido_relacionado',
        lazy=True, 
        cascade='all, delete-orphan'
    )

    def serializar(self) -> Dict[str, Any]:
        """Convierte el pedido y sus artículos a formato de diccionario."""
        return {
            'id': self.id,
            'fecha_hora': self.fecha_hora,
            'articulos': [articulo.serializar() for articulo in self.articulos],
            'subtotal': round(self.subtotal, 2),
            'iva': round(self.iva, 2),
            'total': round(self.total, 2)
        }


class ItemPedido(db.Model):
    """Modelo de la tabla items_pedido para el desglose de cada orden."""
    
    __tablename__: str = 'items_pedido'

    id: int = db.Column(db.Integer, primary_key=True, autoincrement=True)
    pedido_id: int = db.Column(db.Integer, db.ForeignKey('pedidos.id'), nullable=False)
    nombre: str = db.Column(db.String(100), nullable=False)
    tamano: str = db.Column(db.String(50), nullable=False)
    cantidad: int = db.Column(db.Integer, nullable=False, default=1)
    precio: float = db.Column(db.Float, nullable=False, default=0.0)

    def serializar(self) -> Dict[str, Any]:
        """Convierte el detalle del artículo a formato de diccionario."""
        return {
            'nombre': self.nombre,
            'tamano': self.tamano,
            'cantidad': self.cantidad,
            'precio': self.precio
        }