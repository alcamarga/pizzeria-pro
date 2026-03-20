# 🍕 Pizzería Pro — Fullstack App

**Autor:** Camilo Martinez  
**Versión:** 3.0  
**Fecha:** 20/03/2026

Aplicación fullstack desacoplada para gestión de pedidos de pizzería. Backend en Python/Flask con base de datos relacional SQLite y Frontend en Angular 19 con arquitectura standalone. Desarrollada bajo metodología TDD con cobertura de pruebas > 90%.

---

## Estado del Proyecto

| Hito | Estado |
|------|--------|
| API REST con Flask | ✅ Completado |
| Frontend Angular 19 Standalone | ✅ Completado |
| Carrito de compras reactivo | ✅ Completado |
| Variantes de tamaño (Personal/Mediana/Familiar) | ✅ Completado |
| Gestión de cantidades en el carrito | ✅ Completado |
| Endpoint POST /api/pedidos | ✅ Completado |
| Consola de administración con historial | ✅ Completado |
| **Persistencia de Datos Profesional (SQLite + SQLAlchemy)** | ✅ **Completado** |
| Suite de tests Pytest (12/12) | ✅ Completado |

---

## Arquitectura

```
Pizzería Pro
├── backend/
│   ├── app.py          → API REST Flask + configuración SQLAlchemy
│   ├── database.py     → Modelos ORM: Pedido, ItemPedido
│   ├── models.py       → Dataclasses Python (dominio)
│   └── pizzeria.db     → Base de datos SQLite (generada al arrancar)
├── frontend/           → SPA Angular 19 Standalone
│   └── src/app/
│       ├── models/     → Interfaces TypeScript
│       ├── services/   → HttpClient + lógica HTTP
│       └── components/pizza-list/
└── tests/              → 12 tests Pytest (100% pasando)
```

El backend y el frontend son completamente independientes. Se comunican exclusivamente a través de la API REST en `http://127.0.0.1:5000`.

---

## Funcionalidades

### Menú
- Listado de pizzas cargado dinámicamente desde la API (`GET /api/pizzas`)
- Selección dinámica de tamaños (Personal, Mediana, Familiar) con actualización de precio en tiempo real
- Gestión de cantidades con cálculo de subtotal por fila antes de agregar

### Carrito de Compras
- Carrito inteligente: si el mismo producto (pizza + tamaño) ya existe, incrementa la cantidad
- Resumen con columna de cantidad, precio unitario y subtotal por item
- Cálculo automático de Subtotal, IVA (19%) y Gran Total

### Pedidos
- Envío del pedido al backend (`POST /api/pedidos`)
- Persistencia en base de datos SQLite con Flask-SQLAlchemy
- Confirmación visual con mensaje de éxito y limpieza automática del carrito

### Consola de Administración
- Historial completo de ventas (`GET /api/pedidos`) con ID, fecha/hora, detalle y total
- Total acumulado de todas las ventas
- Botón de refresco sin recargar la página

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Python | 3.14 |
| Backend | Flask | 3.x |
| Backend | Flask-CORS | 4.x |
| Backend | Flask-SQLAlchemy | 3.x |
| Backend | SQLite | built-in |
| Frontend | Angular | 19 (Standalone) |
| Frontend | TypeScript | 5.x (strict) |
| Frontend | Bootstrap | 5.x |
| Frontend | HttpClient + RxJS | Angular built-in |
| Frontend | FormsModule | Angular built-in |
| Testing | Pytest | 8.x |

---

## Modelo de Datos Relacional

```
┌─────────────────────────┐       ┌──────────────────────────────┐
│         pedidos         │       │        items_pedido          │
├─────────────────────────┤       ├──────────────────────────────┤
│ id          INTEGER PK  │──┐    │ id          INTEGER PK       │
│ fecha_hora  VARCHAR(20) │  └───▶│ pedido_id   INTEGER FK       │
│ subtotal    FLOAT       │       │ nombre      VARCHAR(100)     │
│ iva         FLOAT       │       │ tamano      VARCHAR(50)      │
│ total       FLOAT       │       │ cantidad    INTEGER          │
└─────────────────────────┘       │ precio      FLOAT            │
                                  └──────────────────────────────┘
```

- Un `Pedido` tiene muchos `ItemPedido` (relación uno-a-muchos)
- Al eliminar un pedido, sus items se eliminan en cascada
- Las tablas se crean automáticamente al arrancar el servidor si no existen

### Modelos Python (Dataclasses de dominio)

```python
@dataclass
class VariantePrecio:
    tamano: str    # "Personal", "Mediana", "Familiar"
    precio: float

@dataclass
class Pizza:
    id: int
    nombre: str
    descripcion: str
    variantes: list[VariantePrecio]
    activo: bool = True
```

---

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/health` | Health check + ruta de la DB |
| `GET` | `/api/pizzas` | Lista de pizzas con variantes |
| `POST` | `/api/pedidos` | Guarda un pedido en SQLite |
| `GET` | `/api/pedidos` | Consulta el historial de pedidos |

### Ejemplo `GET /api/pizzas`
```json
{
  "pizzas": [{
    "id": 1,
    "nombre": "Hawaiana",
    "variantes": [
      { "tamano": "Personal", "precio": 20000 },
      { "tamano": "Mediana",  "precio": 25000 },
      { "tamano": "Familiar", "precio": 32500 }
    ],
    "activo": true
  }]
}
```

### Ejemplo `POST /api/pedidos`
```json
{
  "items": [
    { "nombre": "Hawaiana", "tamano": "Familiar", "cantidad": 2, "precio": 32500 }
  ],
  "total": 77350
}
```

### Ejemplo `GET /api/pedidos`
```json
{
  "pedidos": [{
    "id": 1,
    "fecha_hora": "2026-03-20 10:30:00",
    "items": [{ "nombre": "Hawaiana", "tamano": "Familiar", "cantidad": 2, "precio": 32500 }],
    "subtotal": 65000.0,
    "iva": 12350.0,
    "total": 77350.0
  }],
  "total_pedidos": 1
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
pip install flask flask-cors flask-sqlalchemy

# Levantar el servidor
python backend/app.py
```

Al arrancar verás: `[INFO] Base de datos lista: .../pizzeria.db`  
Verificar en el navegador: `http://127.0.0.1:5000/api/health`

### 2. Frontend (puerto 4200)

```bash
cd D:\Pizzeria-Pro\frontend
npm install
npm start
```

Abrir: `http://localhost:4200`

### 3. Tests (Pytest)

```bash
cd D:\Pizzeria-Pro
pytest tests/ -v
```

Resultado esperado: **12 passed** ✅

---

## Estándares de Calidad

- **Nombres de archivos:** inglés (`pizza.service.ts`, `database.py`)
- **Código y comentarios:** español
- **Tipado fuerte:** Python type hints + TypeScript strict mode
- **ORM:** Flask-SQLAlchemy con modelos tipados
- **TDD:** tests escritos antes de la implementación
- **Cobertura:** > 90% (12/12 tests Pytest pasando)
- **CORS:** configurado para `http://localhost:4200`

---

## Autor

**Camilo Martinez**  
Desarrollador Fullstack · Python & Angular · SQL  
Proyecto desarrollado bajo metodología TDD, arquitectura desacoplada y persistencia relacional con SQLite.

---

## 🚀 Próximos Pasos (Roadmap)

El proyecto tiene una base sólida y production-ready. Estas son las tres evoluciones naturales para llevarlo al siguiente nivel:

---

### 🔐 Autenticación y Perfiles de Usuario

Implementación de un sistema completo de identidad con **JWT (JSON Web Tokens)** para autenticación stateless.

- Registro e inicio de sesión con hash seguro de contraseñas (`bcrypt`)
- Tokens de acceso y refresh con expiración configurable
- Perfiles de cliente: historial de pedidos personales, direcciones de entrega guardadas y preferencias
- Guards en Angular para proteger rutas privadas
- Middleware de autenticación en Flask para endpoints protegidos

**Stack previsto:** `Flask-JWT-Extended` · `Angular Route Guards` · `LocalStorage / HttpOnly Cookies`

---

### 📊 Panel de Business Intelligence

Dashboard administrativo con visualizaciones interactivas en tiempo real para la toma de decisiones basada en datos.

- Gráfica de barras: **pizzas más vendidas** por período (día / semana / mes)
- Gráfica de líneas: **horas pico de pedidos** para optimizar la operación
- Proyecciones de **ingresos mensuales** con tendencia histórica
- KPIs clave: ticket promedio, tasa de conversión y pedidos por hora
- Filtros dinámicos por rango de fechas con actualización sin recarga

**Stack previsto:** `Chart.js` o `D3.js` · `Angular standalone components` · `Flask agregaciones SQL`

---

### ⚡ Optimización y Despliegue en la Nube

Dockerización completa del entorno para garantizar portabilidad, reproducibilidad y escalabilidad horizontal.

- `Dockerfile` independiente para Backend (Flask + Gunicorn) y Frontend (Nginx)
- `docker-compose.yml` que orquesta los tres servicios: Frontend, Backend y base de datos
- Pipeline CI/CD con **GitHub Actions**: build, test y deploy automático en cada push a `main`
- Despliegue en **AWS (ECS + RDS)** o **Azure (App Service + Azure SQL)**
- Variables de entorno gestionadas con `.env` y secretos en el proveedor cloud

**Stack previsto:** `Docker` · `Docker Compose` · `GitHub Actions` · `AWS ECS / Azure App Service`

---

> Proyecto desarrollado con visión de largo plazo: cada decisión de arquitectura tomada hoy
> (desacoplamiento, tipado fuerte, TDD, ORM relacional) fue pensada para que estas evoluciones
> sean incrementales, no refactorizaciones desde cero.
