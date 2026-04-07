# Setup local

## Requisitos

- Python 3.10+
- Node.js (recomendado 18+ o 20+)
- Angular CLI (opcional; se puede usar `npx`)

## Backend (Flask)

Desde la raíz del repo:

```bash
pip install -r backend/requirements.txt
python backend/app.py
```

Backend por defecto en `http://127.0.0.1:5000`.

Health check:

- `GET /api/health`

## Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

Frontend en `http://localhost:4200`.

## Flujo recomendado de desarrollo

1. Levantar backend
2. Levantar frontend
3. Validar que `frontend/src/environments/environment.ts` apunte al backend local (`http://localhost:5000/api`)

