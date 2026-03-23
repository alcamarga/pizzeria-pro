// Componente de inicio de sesión con formularios reactivos.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginCargaUtil } from '../../models/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {
  private fb      = inject(FormBuilder);
  private auth    = inject(AuthService);
  private router  = inject(Router);

  // Formulario reactivo con validaciones
  formulario: FormGroup = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]
  });

  enviando: boolean       = false;
  errorMensaje: string | null = null;

  // Accesos rápidos a los controles para el template
  get email()      { return this.formulario.get('email')!; }
  get contrasena() { return this.formulario.get('contrasena')!; }

  // Envía las credenciales al AuthService y redirige si el login es exitoso
  iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando     = true;
    this.errorMensaje = null;

    const payload: LoginCargaUtil = this.formulario.value as LoginCargaUtil;

    this.auth.iniciarSesion(payload).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/pizzas']);
      },
      error: (err: { status: number }) => {
        this.enviando     = false;
        this.errorMensaje = err.status === 401
          ? 'Credenciales incorrectas. Verifica tu email y contraseña.'
          : 'Error de conexión. Intenta de nuevo más tarde.';
      }
    });
  }
}
