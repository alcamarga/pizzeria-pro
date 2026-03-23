// Servicio compartido para el estado del carrito usando Signals.
// Autor: Camilo Martinez | Fecha: 23/03/2026 | Versión: 1.0

import { Injectable, computed, signal } from '@angular/core';
import { ArticuloPedido } from '../models/pedido';
import { Pizza } from '../models/pizza';

@Injectable({ providedIn: 'root' })
export class CartService {
  listaArticulos = signal<ArticuloPedido[]>([]);

  totalArticulos = computed(() =>
    this.listaArticulos().reduce((acc, a) => acc + a.cantidad, 0)
  );

  totalCarrito = computed(() =>
    this.listaArticulos().reduce((acc, a) => acc + a.precioUnitario * a.cantidad, 0)
  );

  agregarAlCarrito(pizza: Pizza, tamanoIndice: number): void {
    const variante = pizza.variantes[tamanoIndice];
    const nuevoArticulo: ArticuloPedido = {
      pizzaId: pizza.id,
      tamanoId: tamanoIndice,
      cantidad: 1,
      precioUnitario: variante.precio
    };
    this.listaArticulos.update(actual => [...actual, nuevoArticulo]);
  }

  quitarArticulo(indice: number): void {
    this.listaArticulos.update(actual => actual.filter((_, i) => i !== indice));
  }

  vaciarCarrito(): void {
    this.listaArticulos.set([]);
  }
}
