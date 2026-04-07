# API

Base URL (dev): `http://localhost:5000/api`

## Autenticación (JWT)

El frontend envía el token en:

- `Authorization: Bearer <token>`

Endpoints protegidos exigen JWT válido.

## Endpoints públicos

- `GET /health`: health check
- `GET /pizzas`: catálogo
- `POST /auth/registro`: registro (devuelve token)
- `POST /auth/login`: login (devuelve token)

## Endpoints privados

- `POST /pedidos`: crear pedido (JWT; se asocia al usuario del token)
- `GET /pedidos`: historial **global** (JWT con **`rol=admin`**; si no, `403`)
- `GET /pedidos/mis`: historial **solo del usuario** autenticado (JWT)

## Ejemplos

### Login

```bash
curl -X POST "http://localhost:5000/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@pizzeria.com\",\"contrasena\":\"admin1\"}"
```

### Crear pedido (privado)

```bash
curl -X POST "http://localhost:5000/api/pedidos" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer <token>" ^
  -d "{\"items\":[{\"nombre\":\"Pepperoni\",\"tamano\":\"Personal\",\"cantidad\":1,\"precio\":22000}],\"total\":22000}"
```

### Mis pedidos (cliente)

```bash
curl -X GET "http://localhost:5000/api/pedidos/mis" ^
  -H "Authorization: Bearer <token_cliente>"
```

### Historial global (admin)

```bash
curl -X GET "http://localhost:5000/api/pedidos" ^
  -H "Authorization: Bearer <token_admin>"
```

