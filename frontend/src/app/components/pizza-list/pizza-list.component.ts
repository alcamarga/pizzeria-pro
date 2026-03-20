// Componente para mostrar la lista de pizzas y gestionar el pedido.
// Permite agregar pizzas al carrito y calcula el total con IVA del 19%.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PizzaService } from '../../services/pizza.service';
import { Pizza } from '../../models/pizza';

// Tasa de IVA aplicada en Colombia
const IVA: number = 0.19;

// Interfaz para representar una pizza en la tabla del menú
interface PizzaConTamano {
  nombre: string;
  tamano: string;
  precio: number;
  // Referencia a la pizza original para agregar al pedido
  pizzaOriginal: Pizza;
}

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class PizzaListComponent implements OnInit {
  // Lista de pizzas del menú
  pizzas: PizzaConTamano[] = [];
  // Pizzas agregadas al pedido actual
  pedido: Pizza[] = [];
  // Gran total con IVA incluido
  total: number = 0;
  cargando: boolean = true;
  error: string | null = null;
  // Estado del envío del pedido
  enviando: boolean = false;
  pedidoConfirmado: boolean = false;

  constructor(private pizzaService: PizzaService, private cdr: ChangeDetectorRef) {}

  // Obtiene las pizzas del backend al inicializar el componente
  ngOnInit(): void {
    this.pizzaService.obtenerPizzas().subscribe({
      next: (pizzas: Pizza[]) => {
        console.log('Datos recibidos:', pizzas);
        this.pizzas = pizzas.map(p => ({
          nombre: p.nombre,
          tamano: 'Mediana',
          precio: p.precioBase,
          pizzaOriginal: p
        }));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pizzas:', err);
        this.error = `Error ${err.status || 'de conexión'}: No se pudieron cargar las pizzas.`;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Agrega una pizza al pedido y recalcula el total con IVA
  agregarAlPedido(pizza: Pizza): void {
    this.pedido = [...this.pedido, pizza];
    const subtotal: number = this.pedido.reduce((acc, p) => acc + p.precioBase, 0);
    this.total = subtotal * (1 + IVA);
  }

  // Elimina una pizza del pedido por su índice
  eliminarDelPedido(indice: number): void {
    this.pedido = this.pedido.filter((_, i) => i !== indice);
    const subtotal: number = this.pedido.reduce((acc, p) => acc + p.precioBase, 0);
    this.total = subtotal * (1 + IVA);
  }

  // Envía el pedido al backend y limpia el carrito al confirmar
  finalizarPedido(): void {
    if (this.pedido.length === 0) return;
    this.enviando = true;
    this.pizzaService.enviarPedido(this.pedido, this.total).subscribe({
      next: () => {
        this.pedidoConfirmado = true;
        this.pedido = [];
        this.total = 0;
        this.enviando = false;
        this.cdr.detectChanges();
        // Ocultar el mensaje de confirmación después de 4 segundos
        setTimeout(() => {
          this.pedidoConfirmado = false;
          this.cdr.detectChanges();
        }, 4000);
      },
      error: (err) => {
        console.error('Error al enviar pedido:', err);
        this.enviando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Formatea un número como moneda colombiana
  formatearMoneda(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}
