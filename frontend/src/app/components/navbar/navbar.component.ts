// Componente de navegación persistente con control de sesión.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive]
})
export class NavbarComponent {
  public authService  = inject(AuthService);
  public carritoServicio = inject(CartService);
  private router      = inject(Router);

  totalArticulos = this.carritoServicio.totalArticulos;

  get usuario(): Usuario | null {
    return this.authService.obtenerUsuarioActual();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
