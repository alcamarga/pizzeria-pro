// Componente de carrito de compras con Signals.
// Autor: Camilo Martinez | Fecha: 23/03/2026 | Versión: 1.2

import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PizzaService } from '../../services/pizza.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private servicioPizza = inject(PizzaService);
  protected carritoServicio = inject(CartService);

  listaArticulos = this.carritoServicio.listaArticulos;
  totalCarrito   = this.carritoServicio.totalCarrito;

  quitarArticulo(indice: number): void {
    this.carritoServicio.quitarArticulo(indice);
  }

  confirmarPedido(): void {
    this.servicioPizza.enviarNuevoPedido(this.listaArticulos(), this.totalCarrito()).subscribe({
      next: (res) => {
        console.info(`✅ ¡Pedido #${res.id_pedido} enviado con éxito!`);
        alert(`¡Pedido #${res.id_pedido} enviado con éxito! 🍕`);
        this.carritoServicio.vaciarCarrito();
      },
      error: (err) => console.error('Error al enviar el pedido:', err)
    });
  }
}
