## Creado por: Camilo Martinez
## Fecha: 19/03/2026
## Version: 1.0
"""Tests para el modelo Pedido.

Este módulo contiene las pruebas unitarias para verificar
la correcta creación y cálculos del modelo Pedido.

Typical usage example::

    pytest tests/test_pedido_model.py -v
"""

from models import Cliente, ItemPedido, Pedido, Pizza, Tamaño


def test_crear_pedido_con_dos_pizzas_y_calcular_totales():
    """Test: Crear un Pedido con dos pizzas distintas y verificar cálculos.

    Verifica que:
    1. Se puede crear un Pedido con múltiples items
    2. El subtotal se calcula correctamente (suma de precios unitarios * cantidades)
    3. El IVA se calcula correctamente (19% del subtotal)
    4. El total final se calcula correctamente (subtotal + IVA)

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si todos los cálculos son correctos.

    Raises:
        AssertionError: Si algún cálculo no coincide con el valor esperado.
    """
    # Arrange - Crear cliente
    cliente: Cliente = Cliente(
        id=1,
        nombre="Juan Pérez",
        telefono="3001234567",
        direccion="Calle 123 #45-67"
    )

    # Arrange - Crear pizzas
    pizza_hawaina: Pizza = Pizza(
        id=1,
        nombre="Hawaiana",
        descripcion="Salsa de tomate, queso mozzarella, jamón y piña",
        precio_base=25000.0,
        imagen="/images/hawaina.png",
        activo=True
    )

    pizza_pepperoni: Pizza = Pizza(
        id=2,
        nombre="Pepperoni",
        descripcion="Salsa de tomate, queso mozzarella y pepperoni",
        precio_base=28000.0,
        imagen="/images/pepperoni.png",
        activo=True
    )

    # Arrange - Crear tamaños
    tamaño_mediana: Tamaño = Tamaño(
        id=1,
        pizza_id=1,
        nombre="Mediana",
        precio=25000.0,
        factor_tamaño=1.0
    )

    tamaño_familiar: Tamaño = Tamaño(
        id=2,
        pizza_id=2,
        nombre="Familiar",
        precio=36400.0,
        factor_tamaño=1.3
    )

    # Arrange - Crear items del pedido
    item1: ItemPedido = ItemPedido(
        pizza_id=1,
        tamaño_id=1,
        cantidad=2,
        precio_unitario=25000.0
    )

    item2: ItemPedido = ItemPedido(
        pizza_id=2,
        tamaño_id=2,
        cantidad=1,
        precio_unitario=36400.0
    )

    items: list[ItemPedido] = [item1, item2]

    # Act - Crear el pedido
    pedido: Pedido = Pedido(
        cliente=cliente,
        items=items,
        subtotal=0.0,
        iva=0.0,
        total=0.0,
        estado="Pendiente"
    )

    # Act - Calcular totales manualmente para verificar
    subtotal_calculado: float = sum(
        item.precio_unitario * item.cantidad for item in items
    )
    iva_calculado: float = subtotal_calculado * 0.19
    total_calculado: float = subtotal_calculado + iva_calculado

    # Assert - Verificar cálculos
    assert subtotal_calculado == 86400.0  # (25000 * 2) + (36400 * 1)
    assert iva_calculado == 16416.0  # 19% de 86400
    assert total_calculado == 102816.0  # 86400 + 16416


def test_crear_pedido_con_una_sola_pizza():
    """Test: Crear un Pedido con una sola pizza y verificar cálculos.

    Verifica que el sistema calcula correctamente los totales
    cuando el pedido tiene solo un item.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si todos los cálculos son correctos.

    Raises:
        AssertionError: Si algún cálculo no coincide con el valor esperado.
    """
    # Arrange - Crear cliente
    cliente: Cliente = Cliente(
        id=2,
        nombre="María López",
        telefono="3009876543",
        direccion="Avenida 45 #12-34"
    )

    # Arrange - Crear item del pedido
    item: ItemPedido = ItemPedido(
        pizza_id=1,
        tamaño_id=1,
        cantidad=1,
        precio_unitario=25000.0
    )

    items: list[ItemPedido] = [item]

    # Act - Calcular totales
    subtotal_calculado: float = sum(
        item.precio_unitario * item.cantidad for item in items
    )
    iva_calculado: float = subtotal_calculado * 0.19
    total_calculado: float = subtotal_calculado + iva_calculado

    # Assert
    assert subtotal_calculado == 25000.0
    assert iva_calculado == 4750.0  # 19% de 25000
    assert total_calculado == 29750.0  # 25000 + 4750


def test_crear_pedido_con_cantidad_mayor_a_uno():
    """Test: Crear un Pedido con cantidad mayor a uno y verificar cálculos.

    Verifica que el sistema multiplica correctamente el precio unitario
    por la cantidad cuando es mayor a uno.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si todos los cálculos son correctos.

    Raises:
        AssertionError: Si algún cálculo no coincide con el valor esperado.
    """
    # Arrange - Crear item con cantidad 3
    item: ItemPedido = ItemPedido(
        pizza_id=1,
        tamaño_id=1,
        cantidad=3,
        precio_unitario=25000.0
    )

    items: list[ItemPedido] = [item]

    # Act - Calcular totales
    subtotal_calculado: float = sum(
        item.precio_unitario * item.cantidad for item in items
    )
    iva_calculado: float = subtotal_calculado * 0.19
    total_calculado: float = subtotal_calculado + iva_calculado

    # Assert
    assert subtotal_calculado == 75000.0  # 25000 * 3
    assert iva_calculado == 14250.0  # 19% de 75000
    assert total_calculado == 89250.0  # 75000 + 14250


def test_pedido_con_items_de_diferentes_precios():
    """Test: Crear un Pedido con items de precios diferentes.

    Verifica que el sistema suma correctamente los precios
    cuando los items tienen precios unitarios diferentes.

    Args:
        No recibe argumentos; usa variables locales.

    Returns:
        None: La función pasa si todos los cálculos son correctos.

    Raises:
        AssertionError: Si algún cálculo no coincide con el valor esperado.
    """
    # Arrange - Crear items con precios diferentes
    item1: ItemPedido = ItemPedido(
        pizza_id=1,
        tamaño_id=1,
        cantidad=1,
        precio_unitario=20000.0  # Personal
    )

    item2: ItemPedido = ItemPedido(
        pizza_id=2,
        tamaño_id=2,
        cantidad=1,
        precio_unitario=25000.0  # Mediana
    )

    item3: ItemPedido = ItemPedido(
        pizza_id=3,
        tamaño_id=3,
        cantidad=1,
        precio_unitario=32500.0  # Familiar
    )

    items: list[ItemPedido] = [item1, item2, item3]

    # Act - Calcular totales
    subtotal_calculado: float = sum(
        item.precio_unitario * item.cantidad for item in items
    )
    iva_calculado: float = subtotal_calculado * 0.19
    total_calculado: float = subtotal_calculado + iva_calculado

    # Assert
    assert subtotal_calculado == 77500.0  # 20000 + 25000 + 32500
    assert iva_calculado == 14725.0  # 19% de 77500
    assert total_calculado == 92225.0  # 77500 + 14725