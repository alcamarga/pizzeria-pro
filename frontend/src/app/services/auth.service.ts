// Servicio de autenticación JWT con persistencia en localStorage.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  Usuario,
  LoginPayload,
  RegistroPayload,
  AuthResponse,
  SesionActiva
} from '../models/usuario';

// Claves usadas en localStorage
const CLAVE_TOKEN: string   = 'access_token';
const CLAVE_USUARIO: string = 'usuario';

// URLs del backend de autenticación
const API_AUTH_URL: string = 'http://127.0.0.1:5000/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Estado reactivo de la sesión — null significa "no autenticado"
  private sesion$: BehaviorSubject<SesionActiva | null> =
    new BehaviorSubject<SesionActiva | null>(this.cargarSesionGuardada());

  // Observable público para que los componentes y guards se suscriban
  readonly sesionActiva$: Observable<SesionActiva | null> = this.sesion$.asObservable();

  // ─── Consultas de estado ────────────────────────────────────────────────────

  // Devuelve true si hay una sesión activa
  estaAutenticado(): boolean {
    return this.sesion$.getValue() !== null;
  }

  // Devuelve el usuario actual o null si no hay sesión
  obtenerUsuario(): Usuario | null {
    return this.sesion$.getValue()?.usuario ?? null;
  }

  // Devuelve el access token almacenado o null
  obtenerToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  // ─── Autenticación ──────────────────────────────────────────────────────────

  // Envía credenciales al backend, guarda el token y actualiza el estado
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_AUTH_URL}/login`, payload).pipe(
      tap((respuesta: AuthResponse) => this.guardarSesion(respuesta))
    );
  }

  // Registra un nuevo usuario y lo autentica directamente
  registrar(payload: RegistroPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_AUTH_URL}/registro`, payload).pipe(
      tap((respuesta: AuthResponse) => this.guardarSesion(respuesta))
    );
  }

  // Limpia el token, los datos del usuario y emite null al BehaviorSubject
  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.sesion$.next(null);
  }

  // ─── Helpers privados ───────────────────────────────────────────────────────

  // Persiste el token y el usuario en localStorage y actualiza el BehaviorSubject
  private guardarSesion(respuesta: AuthResponse): void {
    localStorage.setItem(CLAVE_TOKEN, respuesta.access_token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.usuario));

    const sesion: SesionActiva = {
      usuario: respuesta.usuario,
      accessToken: respuesta.access_token
    };
    this.sesion$.next(sesion);
  }

  // Intenta reconstruir la sesión desde localStorage al iniciar la app
  private cargarSesionGuardada(): SesionActiva | null {
    const token: string | null   = localStorage.getItem(CLAVE_TOKEN);
    const usuarioRaw: string | null = localStorage.getItem(CLAVE_USUARIO);
    if (!token || !usuarioRaw) return null;

    try {
      const usuario: Usuario = JSON.parse(usuarioRaw) as Usuario;
      return { usuario, accessToken: token };
    } catch {
      // JSON corrupto — limpiar y forzar nuevo login
      localStorage.removeItem(CLAVE_TOKEN);
      localStorage.removeItem(CLAVE_USUARIO);
      return null;
    }
  }
}
