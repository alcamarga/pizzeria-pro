// Guard funcional para proteger rutas que requieren autenticación.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Redirige a /login si no hay sesión activa
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return auth.estaAutenticado()
    ? true
    : router.createUrlTree(['/login']);
};
