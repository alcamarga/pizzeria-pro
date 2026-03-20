# 🍕 Pizzería Pro — Fullstack App

**Autor:** Camilo Martinez  
**Versión:** 2.0  
**Fecha:** 20/03/2026

Aplicación fullstack desacoplada para gestión de pedidos de pizzería. Backend en Python/Flask y Frontend en Angular 19 con arquitectura standalone. Desarrollada bajo metodología TDD con cobertura de pruebas > 90%.

---

## Arquitectura

```
Pizzería Pro
├── backend/          → API REST (Flask · Python 3.14)
│   ├── app.py        → Endpoints + CORS
│   └── models.py     → Dataclasses Python (Pizza, Pedido, Cliente)
├── frontend/         → SPA (Angular 19 · Standalone)
│   └── src/app/
│       ├── models/   → Interfaces TypeScript
│       ├── services/ → HttpClient + lógica HTTP
│       └── components/pizza-list/
└── tests/            → 12 tests Pytest (100% pasando)
```

El backend y el frontend son completamente independientes. Se comunican exclusivamente a través de la API REST en `http://127.0.0.1:5000`.

---

## Funcionalidades

### Menú
- Listado de pizzas cargado dinámicamente desde la API (`GET /api/pizzas`)
- Tabla con nombre, tamaño y precio base formateado en COP

### Carrito de Compras
- Agregar y eliminar pizzas del pedido en tiempo real
- Gestión de estado reactiva con detección de cambios de Angular
- Cálculo automático de Subtotal, IVA (19%) y Gran Total

### Pedidos
- Envío del pedido al backend (`POST /api/pedidos`)
- Confirmación visual con mensaje de éxito y limpieza automática del carrito
- Registro del pedido en la consola del servidor

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Python | 3.14 |
| Backend | Flask | 3.x |
| Backend | Flask-CORS | 4.x |
| Frontend | Angular | 19 (Standalone) |
| Frontend | TypeScript | 5.x (strict) |
| Frontend | Bootstrap | 5.x |
| Frontend | HttpClient + RxJS | Angular built-in |
| Testing | Pytest | 8.x |

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check del servidor |
| `GET` | `/api/pizzas` | Lista de pizzas disponibles |
| `POST` | `/api/pedidos` | Recibe y registra un pedido |

### Ejemplo respuesta `GET /api/pizzas`
```json
{
  "pizzas": [
    {
      "id": 1,
      "nombre": "Hawaiana",
      "descripcion": "Salsa de tomate, queso mozzarella, jamón y piña",
      "precioBase": 25000,
      "activo": true
    }
  ]
}
```

### Ejemplo body `POST /api/pedidos`
```json
{
  "pizzas": [
    { "id": 1, "nombre": "Hawaiana", "precioBase": 25000 }
  ],
  "total": 29750
}
```

---

## Guía de Ejecución

### Requisitos previos
- Python 3.14+
- Node.js 20+ y Angular CLI 19+

### 1. Backend (puerto 5000)

```bash
cd D:\Pizzeria-Pro

# Instalar dependencias
pip install flask flask-cors

# Levantar el servidor
python backend/app.py
```

Verificar en el navegador: `http://127.0.0.1:5000/api/health`

### 2. Frontend (puerto 4200)

```bash
cd D:\Pizzeria-Pro\frontend

# Instalar dependencias
npm install

# Levantar la aplicación
npm start
```

Abrir en el navegador: `http://localhost:4200`

### 3. Tests (Pytest)

```bash
cd D:\Pizzeria-Pro

# Ejecutar los 12 tests
pytest tests/ -v
```

Resultado esperado: **12 passed** ✅

---

## Modelos de Datos

```python
# models.py — Dataclasses con tipado fuerte
@dataclass
class Pizza:
    id: int
    nombre: str
    descripcion: str
    precio_base: float
    activo: bool = True

@dataclass
class ItemPedido:
    pizza: Pizza
    cantidad: int

@dataclass
class Pedido:
    items: list[ItemPedido]
    subtotal: float
    iva: float        # 19%
    total: float
```

---

## Estándares de Calidad

- **Nombres de archivos:** inglés (`pizza.service.ts`, `models.py`)
- **Código y comentarios:** español
- **Tipado fuerte:** Python type hints + TypeScript strict mode
- **TDD:** tests escritos antes de la implementación
- **Cobertura:** > 90% (12/12 tests Pytest pasando)
- **CORS:** configurado para `http://localhost:4200`
- **Sin caracteres especiales** en nombres de variables (ej. `tamano` en lugar de `tamaño`)

---

## Autor

**Camilo Martinez**  
Desarrollador Fullstack · Python & Angular  
Proyecto desarrollado bajo metodología TDD y arquitectura desacoplada.
