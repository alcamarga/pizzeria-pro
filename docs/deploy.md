# Despliegue

## Backend (Render / similar)

- Comando típico: `gunicorn app:app`
- Variables de entorno recomendadas:
  - `JWT_SECRET`: obligatorio en producción
  - `PORT`: lo define la plataforma

Notas:
- El backend habilita CORS para permitir consumo desde el frontend desplegado.

## Frontend (Vercel / similar)

Compilación:

- `ng build --configuration=production`

Rewrites:

- SPA rewrite para que rutas de Angular funcionen (ej. `/mis-pedidos`).

La URL de API de producción se define en:

- `frontend/src/environments/environment.prod.ts`

