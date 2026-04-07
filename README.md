# 🍕 Pizzería Pro — FullStack

**Autor:** Camilo Martinez
**Versión:** 5.2
**Fecha:** 23/03/2026

Aplicación fullstack desacoplada para gestión de pedidos de pizzería. Backend en **Python/Flask** con autenticación **JWT** y base de datos **SQLite**. Frontend en **Angular 18+** con arquitectura standalone, Signals para manejo de estado reactivo, diseño **Glassmorphism** y protección de rutas con **AuthGuard**.

---

## ✨ Características Principales

- 🛒 **Carrito reactivo con Signals** — Estado del carrito compartido via `CartService` usando `signal()` y `computed()`. El badge del navbar se actualiza en tiempo real.
- 🛡️ **Panel de Administración protegido con roles** — Solo usuarios con rol `admin` acceden al historial de ventas y estadísticas.
- 📊 **Gráfica de ventas interactiva con Chart.js** — Pie chart con distribución de unidades vendidas por tipo de pizza.
- 🔐 **Autenticación segura con JWT y AuthGuard** — Registro y login con contraseña encriptada, token HS256 con expiración de 24h.
- 💎 **Interfaz moderna con efecto cristal** — Glassmorphism real con paleta Crema, Dorado y Naranja.

---

## 🏗️ Arquitectura

```
Pizzeria-Pro/
├── backend/
│   ├── app.py          → API REST Flask + JWT + CORS + seed admin
│   ├── database.py     → Modelos ORM: Pedido, ItemPedido, Usuario
│   └── requirements.txt
└── frontend/
    └── src/app/
        ├── models/         → Interfaces TypeScript (Pizza, Pedido, Usuario)
        ├── services/       → PizzaService, AuthService, CartService (Signals)
        ├── interceptors/   → AuthInterceptor (JWT en headers)
        ├── guards/         → AuthGuard (protección de rutas)
        └── components/
            ├── navbar/         → Navbar con badge reactivo del carrito
            ├── cart/           → Carrito standalone con Signals
            ├── login/          → Formulario reactivo con validaciones
            ├── registro/       → Registro de nuevos usuarios
            ├── pizza-list/     → Menú + carrito + panel admin + Chart.js
            └── mis-pedidos/    → Historial personal del cliente
```

---

## 📐 Estándares de Código

| Norma | Descripción |
|-------|-------------|
| Nombres de archivos | En **inglés** (`cart.service.ts`, `pizza-list.component.ts`) |
| Variables y funciones | En **español** (`listaArticulos`, `totalCarrito`, `confirmarPedido`) |
| Estado reactivo | **Angular Signals** (`signal()`, `computed()`) en lugar de RxJS para estado local |
| Inyección de dependencias | `inject()` funcional (Angular 17+ style) |
| Tipado | Estricto — todas las interfaces en `src/app/models/` |
| Componentes | Standalone (sin NgModules) |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Backend | Python | 3.10+ |
| Backend | Flask | 3.x |
| Backend | Flask-CORS | 4.x |
| Backend | Flask-SQLAlchemy | 3.x |
| Backend | PyJWT | 2.x |
| Backend | Gunicorn | 21.x |
| Frontend | Angular | 18+ (Standalone + Signals) |
| Frontend | TypeScript | 5.x (strict) |
| Frontend | Chart.js | 4.x |
| Frontend | Bootstrap | 5.x |
| Testing | Pytest | 8.x |

---

## 🚀 Guía de Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pizzeria-pro.git
cd pizzeria-pro
```

### 2. Backend (Flask — puerto 5000)

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

Verificar: `http://127.0.0.1:5000/api/health`

### 3. Frontend (Angular — puerto 4200)

```bash
cd frontend
npm install
ng serve
```

Abrir: `http://localhost:4200`

---

## 🔑 Credenciales de Prueba

```
Email:    admin@pizzeria.com
Password: admin1
```

---

## ☁️ Despliegue y Configuración

### Backend — Render

Comando de inicio: `gunicorn app:app`

CORS configurado con `@after_request` handler para garantizar headers en todas las respuestas:

```python
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET","POST","PUT","DELETE","OPTIONS"], "allow_headers": ["Content-Type","Authorization"]}})

@app.after_request
def agregar_headers_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response
```

### Frontend — Vercel

`frontend/vercel.json`:
```json
{
  "buildCommand": "ng build --configuration=production",
  "outputDirectory": "dist/frontend/browser",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

`angular.json` — `fileReplacements` en producción:
```json
"fileReplacements": [
  { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
]
```

`environment.prod.ts`:
```typescript
export const environment = {
  produccion: true,
  apiUrl: 'https://pizzeria-pro.onrender.com/api'
};
```

---

## 📡 API Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `GET` | `/api/health` | No | Health check |
| `GET` | `/api/pizzas` | No | Lista de pizzas |
| `POST` | `/api/auth/registro` | No | Registro de usuario |
| `POST` | `/api/auth/login` | No | Login, devuelve JWT |
| `POST` | `/api/pedidos` | JWT | Crear pedido (asociado al usuario del token) |
| `GET` | `/api/pedidos` | JWT **admin** | Historial global (panel administración) |
| `GET` | `/api/pedidos/mis` | JWT | Historial del usuario autenticado |

El frontend usa `GET /api/pedidos` solo en el panel admin (`pizza-list` con rol `admin`) y `GET /api/pedidos/mis` en **Mis pedidos**.

---

## 🗺️ Rutas del Frontend

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Redirige a `/pizzas` |
| `/pizzas` | Público | Menú + carrito |
| `/carrito` | Público | Vista del carrito |
| `/login` | Público | Inicio de sesión |
| `/registro` | Público | Crear cuenta |
| `/mis-pedidos` | Autenticado | Historial personal |

---

**Camilo Martinez** — Desarrollador Fullstack · Python & Angular
