# Seguridad

## JWT

- Algoritmo: HS256
- El token se firma/verifica con `JWT_SECRET`
- Expiración: 24h (ver `JWT_EXPIRACION_HORAS` en `backend/app.py`)

## Endpoints privados

- `POST /api/pedidos`: JWT (cualquier usuario autenticado)
- `GET /api/pedidos/mis`: JWT (historial propio)
- `GET /api/pedidos`: JWT **y** rol `admin` (historial global)

## CORS

El backend permite `origins="*"` y agrega headers CORS en `after_request`.

Recomendación para producción:

- restringir `origins` al dominio del frontend
- no usar un `JWT_SECRET` hardcodeado

