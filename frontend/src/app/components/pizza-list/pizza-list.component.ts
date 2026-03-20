// Componente para mostrar el menú y gestionar el pedido con variantes de tamaño.
// Autor: Camilo Martinez
// Fecha: 20/03/2026

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzaService } from '../../services/pizza.service';
import { Pizza, VariantePrecio } from '../../models/pizza';

// Tasa de IVA aplicada en Colombia
const IVA: number = 0.19;

// Item del carrito: pizza + variante seleccionada por el usuario
interface ItemCarrito {
  pizza: Pizza;
  variante: VariantePrecio;
}

@Component({
  selector: 'app-pizza-list',
  templateUrl: './pizza-list.component.html',
  styleUrls: ['./pizza-list.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class PizzaListComponent implements OnInit {
  // Lista de pizzas del menú
  pizzas: Pizza[] = [];
  // Variante seleccionada por pizza (clave: pizza.id)
  variantesSeleccionadas: Record<number, VariantePrecio> = {};
  // Items del carrito con pizza y variante elegida
  carrito: ItemCarrito[] = [];
  // Gran total con IVA incluido
  total: number = 0;
  cargando: boolean = true;
  error: string | null = null;
  enviando: boolean = false;
  pedidoConfirmado: boolean = false;

  constructor(private pizzaService: PizzaService, private cdr: ChangeDetectorRef) {}

  // Carga las pizzas del backend e inicializa la variante por defecto de cada una
  ngOnInit(): void {
    this.pizzaService.obtenerPizzas().subscribe({
      next: (pizzas: Pizza[]) => {
        this.pizzas = pizzas;
        // Inicializar cada pizza con su primera variante seleccionada
        pizzas.forEach(p => {
          if (p.variantes.length > 0) {
            this.variantesSeleccionadas[p.id] = p.variantes[0];
          }
        });
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

  // Actualiza la variante seleccionada cuando el usuario cambia el <select>
  cambiarVariante(pizzaId: number, tamano: string): void {
    const pizza: Pizza | undefined = this.pizzas.find(p => p.id === pizzaId);
    if (!pizza) return;
    const variante: VariantePrecio | undefined = pizza.variantes.find(v => v.tamano === tamano);
    if (variante) {
      this.variantesSeleccionadas[pizzaId] = variante;
    }
  }

  // Agrega al carrito la pizza con la variante actualmente seleccionada
  agregarAlCarrito(pizza: Pizza): void {
    const variante: VariantePrecio = this.variantesSeleccionadas[pizza.id];
    if (!variante) return;
    this.carrito = [...this.carrito, { pizza, variante }];
    this.recalcularTotal();
  }

  // Elimina un item del carrito por su índice
  eliminarDelCarrito(indice: number): void {
    this.carrito = this.carrito.filter((_, i) => i !== indice);
    this.recalcularTotal();
  }

  // Recalcula el total del carrito con IVA
  private recalcularTotal(): void {
    const subtotal: number = this.carrito.reduce((acc, item) => acc + item.variante.precio, 0);
    this.total = subtotal * (1 + IVA);
  }

  // Envía el pedido al backend y limpia el carrito al confirmar
  finalizarPedido(): void {
    if (this.carrito.length === 0) return;
    this.enviando = true;
    // Construir payload con pizzas y variantes seleccionadas
    const pizzasPayload: Pizza[] = this.carrito.map(item => item.pizza);
    this.pizzaService.enviarPedido(pizzasPayload, this.total).subscribe({
      next: () => {
        this.pedidoConfirmado = true;
        this.carrito = [];
        this.total = 0;
        this.enviando = false;
        this.cdr.detectChanges();
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
