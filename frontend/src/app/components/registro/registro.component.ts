// Componente de registro de nuevos usuarios.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegistroPayload } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegistroComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);

  // Formulario con nombre, email y contraseña
  formulario: FormGroup = this.fb.group({
    nombre:     ['', [Validators.required, Validators.minLength(2)]],
    email:      ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]]
  });

  enviando: boolean           = false;
  errorMensaje: string | null = null;

  // Accesos rápidos para el template
  get nombre()     { return this.formulario.get('nombre')!; }
  get email()      { return this.formulario.get('email')!; }
  get contrasena() { return this.formulario.get('contrasena')!; }

  // Envía el formulario al AuthService y redirige al menú si el registro es exitoso
  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando     = true;
    this.errorMensaje = null;

    const payload: RegistroPayload = this.formulario.value as RegistroPayload;

    this.auth.registrar(payload).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/pizzas']);
      },
      error: (err) => {
        this.enviando     = false;
        this.errorMensaje = err.status === 409
          ? 'Este correo ya está registrado. Intenta iniciar sesión.'
          : 'Error al registrar. Intenta de nuevo más tarde.';
      }
    });
  }
}
