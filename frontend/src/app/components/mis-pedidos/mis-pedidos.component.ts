// Componente para que el usuario vea su historial de pedidos.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaService, RegistroPedido, ArticuloHistorial } from '../../services/pizza.service';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MisPedidosComponent implements OnInit {
  private pizzaService = inject(PizzaService);

  pedidos: RegistroPedido[] = [];
  cargando: boolean           = true;
  error: string | null        = null;

  ngOnInit(): void {
    this.pizzaService.obtenerHistorialDeVentas().subscribe({
      next: (pedidos: RegistroPedido[]) => {
        this.pedidos  = pedidos;
        this.cargando = false;
      },
      error: () => {
        this.error    = 'No se pudo cargar el historial. Verifica tu conexión.';
        this.cargando = false;
      }
    });
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(valor);
  }

  generarDetalle(pedido: RegistroPedido): string {
    return pedido.articulos
      .map((i: ArticuloHistorial) => `${i.nombre} (${i.tamano}) x${i.cantidad}`)
      .join(', ');
  }
}
