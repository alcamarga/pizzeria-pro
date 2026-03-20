// Configuración principal de la aplicación Angular.
// Este archivo configura los proveedores globales de la aplicación
// Pizzería Pro, incluyendo el router y el HttpClient para peticiones HTTP.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};