# Variables de entorno y configuración

## Backend (`backend/app.py`)

- **`JWT_SECRET`**: clave para firmar/verificar tokens JWT (HS256).
  - Si no se define, el backend usa un valor por defecto (no recomendado para producción).
- **`PORT`**: puerto del servidor (por defecto `5000`).

### Ejemplo (PowerShell)

```powershell
$env:JWT_SECRET="cambia-esto-en-produccion"
$env:PORT="5000"
python backend/app.py
```

## Frontend (Angular)

La URL del backend se define en:

- Dev: `frontend/src/environments/environment.ts`
- Prod: `frontend/src/environments/environment.prod.ts`

Propiedad usada por los services:

- **`environment.apiUrl`** (ej. `http://localhost:5000/api`)

