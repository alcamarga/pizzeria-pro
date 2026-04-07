# Troubleshooting

## 401 Unauthorized en endpoints privados

- Verifica que estás enviando el header:
  - `Authorization: Bearer <token>`
- Si el token expiró, vuelve a hacer login.
- Si cambiaste `JWT_SECRET` en backend, tokens antiguos dejan de ser válidos.

## 403 Forbidden en `GET /api/pedidos`

- Ese endpoint es **solo para administradores**. Los clientes deben usar `GET /api/pedidos/mis`.

## Error CORS en el navegador

- Confirma que el backend está corriendo y accesible.
- El navegador hace preflight `OPTIONS`; el backend debe responder correctamente.
- Asegura que el frontend apunte al `apiUrl` correcto en `environment.ts`.

## Backend levanta pero no guarda datos

- Revisa permisos de escritura en `backend/` (SQLite crea `pizzeria.db` ahí).
- Si usas despliegue, confirma que el filesystem sea persistente o usa un DB gestionado.

