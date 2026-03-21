// Interfaces para el modelo Usuario y autenticación JWT.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

// Datos del usuario autenticado (payload del JWT)
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

// Roles disponibles en el sistema
export type RolUsuario = 'cliente' | 'admin';

// Payload para el formulario de registro
export interface RegistroPayload {
  nombre: string;
  email: string;
  contrasena: string;
}

// Payload para el formulario de inicio de sesión
export interface LoginPayload {
  email: string;
  contrasena: string;
}

// Respuesta del backend al autenticar correctamente
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  usuario: Usuario;
}

// Estado de sesión almacenado en memoria por el servicio de auth
export interface SesionActiva {
  usuario: Usuario;
  accessToken: string;
}
