"""Tests para el modelo Pizza.

Este módulo contiene las pruebas unitarias para verificar
la correcta creación y funcionalidad de la clase Pizza.

Typical usage example::

    pytest tests/test_pizza_model.py -v
"""

import pytest

from models import Pizza


def test_crear_pizza_con_todos_los_campos():
    """Test: Crear una Pizza con todos los campos obligatorios.

    Verifica que se puede crear una instancia de Pizza con nombre,
    descripción, precio base, imagen y estado activo.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si la creación es exitosa.

    Raises:
        AssertionError: Si la creación falla o los campos no coinciden.
    """
    # Arrange
    nombre: str = "Hawaiana"
    descripcion: str = "Salsa de tomate, queso mozzarella, jamón y piña"
    precio_base: float = 25000.0
    imagen: str = "/images/hawaina.png"
    activo: bool = True

    # Act
    pizza: Pizza = Pizza(
        id=1,
        nombre=nombre,
        descripcion=descripcion,
        precio_base=precio_base,
        imagen=imagen,
        activo=activo
    )

    # Assert
    assert pizza.id == 1
    assert pizza.nombre == nombre
    assert pizza.descripcion == descripcion
    assert pizza.precio_base == precio_base
    assert pizza.imagen == imagen
    assert pizza.activo == activo


def test_crear_pizza_sin_imagen():
    """Test: Crear una Pizza sin imagen (campo opcional).

    Verifica que se puede crear una Pizza sin proporcionar una imagen.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si la creación es exitosa.

    Raises:
        AssertionError: Si la creación falla o el campo imagen no es None.
    """
    # Arrange
    nombre: str = "Pepperoni"
    descripcion: str = "Salsa de tomate, queso mozzarella y pepperoni"
    precio_base: float = 28000.0
    imagen: str | None = None
    activo: bool = True

    # Act
    pizza: Pizza = Pizza(
        id=2,
        nombre=nombre,
        descripcion=descripcion,
        precio_base=precio_base,
        imagen=imagen,
        activo=activo
    )

    # Assert
    assert pizza.id == 2
    assert pizza.nombre == nombre
    assert pizza.imagen is None
    assert pizza.activo is True


def test_pizza_con_precio_base_cero():
    """Test: Crear una Pizza con precio base cero.

    Verifica que una Pizza puede tener un precio base de 0.0.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si la creación es exitosa.

    Raises:
        AssertionError: Si el precio base no es 0.0.
    """
    # Arrange
    nombre: str = "Promocion"
    descripcion: str = "Pizza promocional"
    precio_base: float = 0.0
    imagen: str = "/images/promo.png"
    activo: bool = True

    # Act
    pizza: Pizza = Pizza(
        id=3,
        nombre=nombre,
        descripcion=descripcion,
        precio_base=precio_base,
        imagen=imagen,
        activo=activo
    )

    # Assert
    assert pizza.precio_base == 0.0


def test_pizza_inactiva():
    """Test: Crear una Pizza inactiva.

    Verifica que se puede crear una Pizza con estado inactivo.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si la creación es exitosa.

    Raises:
        AssertionError: Si el estado activo no es False.
    """
    # Arrange
    nombre: str = "Descontinuada"
    descripcion: str = "Pizza ya no disponible"
    precio_base: float = 15000.0
    imagen: str = "/images/descontinuada.png"
    activo: bool = False

    # Act
    pizza: Pizza = Pizza(
        id=4,
        nombre=nombre,
        descripcion=descripcion,
        precio_base=precio_base,
        imagen=imagen,
        activo=activo
    )

    # Assert
    assert pizza.activo is False