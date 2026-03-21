// Componente principal de la aplicación.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pizzería Pro');
}