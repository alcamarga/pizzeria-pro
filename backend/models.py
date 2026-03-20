## Creado por: Camilo Martinez
## Fecha: 19/03/2026
## Version: 2.0
"""Modelos de datos para la Pizzería Pro.

Este módulo define las clases principales del dominio:
- VariantePrecio: Representa un tamaño con su precio
- Pizza: Representa una pizza con sus variantes de precio
- Tamaño: Representa un tamaño de pizza (Personal, Mediana, Familiar)
- Cliente: Representa un cliente que hace un pedido
- Pedido: Representa un pedido completo
"""

from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class VariantePrecio:
    """Variante de precio para una pizza según su tamaño.

    Attributes:
        tamano: Nombre del tamaño ("Personal", "Mediana", "Familiar")
        precio: Precio para este tamaño en COP
    """
    tamano: str
    precio: float


@dataclass
class Pizza:
    """Modelo de datos para una pizza del menú.

    Attributes:
        id: Identificador único de la pizza
        nombre: Nombre de la pizza (ej. "Hawaiana", "Pepperoni")
        descripcion: Descripción de ingredientes
        variantes: Lista de variantes de precio por tamaño
        imagen: URL o ruta de la imagen (opcional)
        activo: Si la pizza está disponible para pedidos
    """
    id: int
    nombre: str
    descripcion: str
    variantes: list[VariantePrecio] = field(default_factory=list)
    imagen: str | None = None
    activo: bool = True


@dataclass
class Tamaño:
    """Modelo de datos para un tamaño de pizza.

    Attributes:
        id: Identificador único del tamaño
        pizza_id: Referencia a la pizza
        nombre: Nombre del tamaño ("Personal", "Mediana", "Familiar")
        precio: Precio específico para este tamaño
        factor_tamaño: Factor multiplicador (0.8, 1.0, 1.3)
    """
    id: int
    pizza_id: int
    nombre: str
    precio: float
    factor_tamaño: float


@dataclass
class Cliente:
    """Modelo de datos para un cliente.

    Attributes:
        id: Identificador único del cliente
        nombre: Nombre del cliente
        telefono: Teléfono de contacto
        direccion: Dirección de entrega
    """
    id: int
    nombre: str
    telefono: str
    direccion: str


@dataclass
class ItemPedido:
    """Modelo de datos para un item de pedido.

    Attributes:
        pizza_id: Referencia a la pizza
        tamaño_id: Referencia al tamaño seleccionado
        cantidad: Cantidad de esta pizza en el pedido
        precio_unitario: Precio unitario al momento del pedido
    """
    pizza_id: int
    tamaño_id: int
    cantidad: int
    precio_unitario: float


@dataclass
class Pedido:
    """Modelo de datos para un pedido completo.

    Attributes:
        id: Identificador único del pedido
        cliente: Datos del cliente
        items: Lista de items del pedido
        subtotal: Subtotal sin IVA
        iva: IVA calculado (19%)
        total: Total con IVA
        estado: Estado del pedido ("Pendiente", "En preparación", "Entregado")
        fecha_hora: Fecha y hora del pedido
    """
    id: int | None = None
    cliente: Cliente | None = None
    items: list[ItemPedido] | None = None
    subtotal: float = 0.0
    iva: float = 0.0
    total: float = 0.0
    estado: str = "Pendiente"
    fecha_hora: datetime | None = None