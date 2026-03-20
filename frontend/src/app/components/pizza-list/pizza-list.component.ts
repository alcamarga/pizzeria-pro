// Componente para mostrar el menú y gestionar el carrito con cantidades.
// Autor: Camilo Martinez
// Fecha: 20/03/2026

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzaService, PedidoHistorial } from '../../services/pizza.service';
import { Pizza, VariantePrecio } from '../../models/pizza';

// Tasa de IVA aplicada en Colombia
const IVA: number = 0.19;

// Item del carrito: pizza + variante + cantidad
interface ItemCarrito {
  pizza: Pizza;
  variante: VariantePrecio;
  cantidad: number;
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
  // Cantidad seleccionada por pizza antes de agregar (clave: pizza.id)
  cantidadesSeleccionadas: Record<number, number> = {};
  // Items del carrito
  carrito: ItemCarrito[] = [];
  // Gran total con IVA incluido
  total: number = 0;
  cargando: boolean = true;
  error: string | null = null;
  enviando: boolean = false;
  pedidoConfirmado: boolean = false;
  // Historial de pedidos del backend
  historial: PedidoHistorial[] = [];
  cargandoHistorial: boolean = false;

  constructor(private pizzaService: PizzaService, private cdr: ChangeDetectorRef) {}

  // Carga las pizzas e inicializa variante y cantidad por defecto para cada una
  ngOnInit(): void {
    this.pizzaService.obtenerPizzas().subscribe({
      next: (pizzas: Pizza[]) => {
        this.pizzas = pizzas;
        pizzas.forEach(p => {
          if (p.variantes.length > 0) {
            this.variantesSeleccionadas[p.id] = p.variantes[0];
          }
          this.cantidadesSeleccionadas[p.id] = 1;
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
    this.cargarHistorial();
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

  // Calcula el subtotal de la fila (cantidad x precio de la variante seleccionada)
  calcularSubtotalFila(pizzaId: number): number {
    const variante: VariantePrecio = this.variantesSeleccionadas[pizzaId];
    const cantidad: number = this.cantidadesSeleccionadas[pizzaId] ?? 1;
    if (!variante) return 0;
    return variante.precio * cantidad;
  }

  // Agrega al carrito con la variante y cantidad seleccionadas.
  // Si ya existe el mismo producto (pizza + tamaño), incrementa la cantidad.
  agregarAlCarrito(pizza: Pizza): void {
    const variante: VariantePrecio = this.variantesSeleccionadas[pizza.id];
    const cantidad: number = this.cantidadesSeleccionadas[pizza.id] ?? 1;
    if (!variante || cantidad < 1) return;

    // Buscar si ya existe el mismo producto en el carrito
    const indiceExistente: number = this.carrito.findIndex(
      item => item.pizza.id === pizza.id && item.variante.tamano === variante.tamano
    );

    if (indiceExistente >= 0) {
      // Incrementar cantidad del item existente
      this.carrito = this.carrito.map((item, i) =>
        i === indiceExistente
          ? { ...item, cantidad: item.cantidad + cantidad }
          : item
      );
    } else {
      // Agregar nuevo item al carrito
      this.carrito = [...this.carrito, { pizza, variante, cantidad }];
    }

    // Resetear cantidad del selector a 1
    this.cantidadesSeleccionadas[pizza.id] = 1;
    this.recalcularTotal();
  }

  // Elimina un item del carrito por su índice
  eliminarDelCarrito(indice: number): void {
    this.carrito = this.carrito.filter((_, i) => i !== indice);
    this.recalcularTotal();
  }

  // Recalcula el total del carrito con IVA
  private recalcularTotal(): void {
    const subtotal: number = this.carrito.reduce(
      (acc, item) => acc + item.variante.precio * item.cantidad, 0
    );
    this.total = subtotal * (1 + IVA);
  }

  // Envía el pedido al backend y limpia el carrito al confirmar
  finalizarPedido(): void {
    if (this.carrito.length === 0) return;
    this.enviando = true;

    // Construir payload con items detallados (nombre, tamaño, cantidad, precio)
    const itemsPayload = this.carrito.map(item => ({
      nombre: item.pizza.nombre,
      tamano: item.variante.tamano,
      cantidad: item.cantidad,
      precio: item.variante.precio
    }));

    this.pizzaService.enviarPedido(itemsPayload, this.total).subscribe({
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

  // Carga el historial de pedidos desde el backend
  cargarHistorial(): void {
    this.cargandoHistorial = true;
    this.pizzaService.obtenerHistorial().subscribe({
      next: (pedidos: PedidoHistorial[]) => {
        this.historial = pedidos.slice().reverse();
        this.cargandoHistorial = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.cargandoHistorial = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Calcula el total acumulado de todos los pedidos del historial
  totalAcumulado(): number {
    return this.historial.reduce((acc, p) => acc + p.total, 0);
  }

  // Genera el detalle resumido de un pedido (nombres de pizzas separados por coma)
  generarDetalle(pedido: PedidoHistorial): string {
    return pedido.items
      .map(item => `${item.nombre} (${item.tamano}) x${item.cantidad}`)
      .join(', ');
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
