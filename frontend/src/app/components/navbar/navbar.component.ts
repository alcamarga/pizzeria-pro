// Componente de navegación persistente con control de sesión.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router     = inject(Router);

  // Devuelve el usuario activo o null
  get usuario(): Usuario | null {
    return this.authService.obtenerUsuario();
  }

  // Cierra sesión y redirige al login
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
