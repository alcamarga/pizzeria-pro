# 🍕 Pizzería Pro — Fullstack App

**Autor:** Camilo Martinez
**Versión:** 4.0
**Fecha:** 21/03/2026

Aplicación fullstack desacoplada para gestión de pedidos de pizzería. Backend en Python/Flask con base de datos relacional SQLite, autenticación JWT y Frontend en Angular 19 con arquitectura standalone, Glassmorphism UI y AuthGuard. Desarrollada bajo metodología TDD con cobertura > 90%.

---

## Estado del Proyecto

| Hito | Estado |
|------|--------|
| API REST con Flask | ✅ Completado |
| Frontend Angular 19 Standalone | ✅ Completado |
| Carrito de compras reactivo | ✅ Completado |
| Variantes de tamaño (Personal/Mediana/Familiar) | ✅ Completado |
| Gestión de cantidades en el carrito | ✅ Completado |
| Persistencia SQLite + Flask-SQLAlchemy | ✅ Completado |
| Autenticación JWT (registro + login) | ✅ Completado |
| AuthGuard + AuthInterceptor Angular | ✅ Completado |
| Navbar persistente con control de sesión | ✅ Completado |
| Panel Admin (historial de ventas) | ✅ Completado |
| Glassmorphism UI con fondo rústico | ✅ Completado |
| Suite de tests Pytest (12/12) | ✅ Completado |

---

## Arquitectura

```
Pizzeria-Pro/
├── backend/
│   ├── app.py          → API REST Flask v4.0 + JWT + seed admin
│   ├── database.py     → Modelos ORM: Pedido, ItemPedido, Usuario
│   ├── models.py       → Dataclasses Python (dominio)
│   └── pizzeria.db     → SQLite (generada al arrancar, excluida del repo)
├── frontend/
│   └── src/app/
│       ├── models/         → Interfaces TypeScript (Pizza, Usuario)
│       ├── services/       → PizzaService, AuthService
│       ├── interceptors/   → AuthInterceptor (JWT en headers)
│       ├── guards/         → AuthGuard (protección de rutas)
│       └── components/
│           ├── navbar/         → Navbar persistente con glassmorphism
│           ├── login/          → Formulario reactivo con validaciones
│           ├── registro/       → Registro de nuevos usuarios
│           ├── pizza-list/     → Menú + carrito + panel admin
│           └── mis-pedidos/    → Historial personal del cliente
└── tests/              → 12 tests Pytest (100% pasando)
```

---

## Funcionalidades

### Menú Público
- Listado de pizzas desde la API (`GET /api/pizzas`)
- Selector de tamaños (Personal / Mediana / Familiar) con precio en tiempo real
- Gestión de cantidades con subtotal por fila antes de agregar
- Carrito inteligente: incrementa cantidad si el mismo producto ya existe

### Autenticación
- Registro de nuevos usuarios con contraseña encriptada (`werkzeug`)
- Login con JWT firmado (HS256, expira en 24h)
- `AuthInterceptor`: inyecta `Authorization: Bearer <token>` en cada petición
- `AuthGuard`: protege rutas privadas y redirige a `/login` si no hay sesión
- Logout limpia `localStorage` y emite estado `null` al `BehaviorSubject`

### Carrito y Pedidos
- Resumen con cantidad, precio unitario y subtotal por item
- Cálculo automático de Subtotal, IVA (19%) y Gran Total
- Botón "Finalizar Pedido": redirige a `/login` si no hay sesión activa
- Persistencia en SQLite con relación `Pedido → ItemPedido`

### Panel de Administración
- Historial completo de ventas visible **solo para usuarios con rol `admin`**
- Total acumulado de todas las ventas
- Botón de refresco sin recargar la página

### Mis Pedidos
- Vista personal del historial de pedidos del cliente autenticado
- Detalle de items, subtotal, IVA y total por pedido

### UI / UX
- Fondo rústico de pizzería (Unsplash, `background-attachment: fixed`)
- Glassmorphism: `background: rgba(0,0,0,0.5)` + `backdrop-filter: blur(15px)`
- Paleta: Crema `#F5F5F5`, Dorado `#FFC107`, Naranja `#FF5722`
- Navbar sticky con estado de sesión reactivo

---

## Credenciales de Acceso

### Usuario Admin (Panel de Ventas)
```
Email:    admin@pizzeria.com
Password: admin1
```
El usuario admin se crea automáticamente al arrancar el backend si no existe.

### Crear cuenta de cliente
Navega a `/registro` o haz clic en "Regístrate aquí" desde el login.

---

## Tecnologías

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Python | 3.14 |
| Backend | Flask | 3.x |
| Backend | Flask-CORS | 4.x |
| Backend | Flask-SQLAlchemy | 3.x |
| Backend | PyJWT | 2.x |
| Backend | Werkzeug | 3.x |
| Backend | SQLite | built-in |
| Frontend | Angular | 19 (Standalone) |
| Frontend | TypeScript | 5.x (strict) |
| Frontend | Bootstrap | 5.x |
| Frontend | RxJS | 7.x |
| Testing | Pytest | 8.x |

---

## Modelo de Datos Relacional

```
┌──────────────────────┐     ┌──────────────────────────┐
│       usuarios       │     │         pedidos          │
├──────────────────────┤     ├──────────────────────────┤
│ id        INTEGER PK │     │ id         INTEGER PK    │
│ nombre    VARCHAR    │     │ fecha_hora VARCHAR        │
│ email     VARCHAR    │     │ subtotal   FLOAT         │
│ hash      VARCHAR    │     │ iva        FLOAT         │
│ rol       VARCHAR    │     │ total      FLOAT         │
│ fecha_reg VARCHAR    │     └────────────┬─────────────┘
└──────────────────────┘                  │ 1:N
                                          ▼
                              ┌──────────────────────────┐
                              │       items_pedido       │
                              ├──────────────────────────┤
                              │ id        INTEGER PK     │
                              │ pedido_id INTEGER FK     │
                              │ nombre    VARCHAR        │
                              │ tamano    VARCHAR        │
                              │ cantidad  INTEGER        │
                              │ precio    FLOAT          │
                              └──────────────────────────┘
```

---

## API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Health check |
| `GET` | `/api/pizzas` | No | Lista de pizzas con variantes |
| `POST` | `/api/auth/registro` | No | Registro de usuario |
| `POST` | `/api/auth/login` | No | Login, devuelve JWT |
| `POST` | `/api/pedidos` | JWT | Guarda pedido en SQLite |
| `GET` | `/api/pedidos` | JWT | Historial de pedidos |

---

## Guía de Instalación

### Requisitos previos
- Python 3.14+
- Node.js 20+ y Angular CLI 19+
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/alcamarga/pizzeria-pro.git
cd pizzeria-pro
```

### 2. Backend (puerto 5000)

```bash
# Instalar dependencias
pip install flask flask-cors flask-sqlalchemy PyJWT werkzeug

# Levantar el servidor
python backend/app.py
```

Al arrancar verás:
```
[INFO] Base de datos lista: .../pizzeria.db
[INFO] Usuario admin creado: admin@pizzeria.com / admin1
```

Verificar: `http://127.0.0.1:5000/api/health`

### 3. Frontend (puerto 4200)

```bash
cd frontend
npm install
npm start
```

Abrir: `http://localhost:4200`

### 4. Tests

```bash
cd ..
pytest tests/ -v
```

Resultado esperado: **12 passed** ✅

---

## Rutas del Frontend

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Redirige a `/pizzas` |
| `/pizzas` | Público | Menú + carrito |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Crear cuenta |
| `/mis-pedidos` | Autenticado | Historial personal |
| `/pedido` | Autenticado | Checkout |

---

## Estándares de Calidad

- Nombres de archivos en inglés (`auth.service.ts`, `database.py`)
- Código y comentarios en español
- Tipado fuerte: Python type hints + TypeScript strict mode
- TDD: tests escritos antes de la implementación
- Cobertura > 90% (12/12 tests Pytest)
- CORS configurado para `http://localhost:4200`
- JWT con expiración de 24h, clave configurable via variable de entorno `JWT_SECRET`

---

## Roadmap

### 🔐 Autenticación Avanzada
Refresh tokens, recuperación de contraseña por email y OAuth2 (Google).

### 📊 Panel de Business Intelligence
Dashboard con Chart.js: pizzas más vendidas, horas pico e ingresos mensuales.

### ⚡ Dockerización y Despliegue
`docker-compose` con Frontend (Nginx), Backend (Gunicorn) y CI/CD con GitHub Actions para despliegue en AWS/Azure.

---

## Autor

**Camilo Martinez**
Desarrollador Fullstack · Python & Angular · SQL
Proyecto desarrollado bajo metodología TDD, arquitectura desacoplada, autenticación JWT y persistencia relacional con SQLite.
