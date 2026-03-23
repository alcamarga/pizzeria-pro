// Interfaces para el modelo Usuario y autenticación JWT.
// Autor: Camilo Martinez | Fecha: 23/03/2026 | Versión: 4.1

export type RolUsuario = 'cliente' | 'admin';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

// Datos necesarios para el formulario de registro
export interface RegistroCargaUtil {
  nombre: string;
  email: string;
  contrasena: string;
}

// Datos necesarios para el inicio de sesión
export interface LoginCargaUtil {
  email: string;
  contrasena: string;
}

// Estructura de la respuesta del servidor al autenticar
export interface RespuestaAutenticacion {
  access_token: string;
  refresh_token: string;
  usuario: Usuario;
}

// Representación de la sesión activa en el estado de la aplicación
export interface SesionActiva {
  usuario: Usuario;
  accessToken: string;
}