// Componente para mostrar el menú y gestionar el carrito con cantidades.
// Autor: Camilo Martinez
// Fecha: 21/03/2026

import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables, TooltipItem } from 'chart.js';
import { PizzaService, PedidoHistorial } from '../../services/pizza.service';
import { AuthService } from '../../services/auth.service';
import { Pizza, VariantePrecio } from '../../models/pizza';

// Registrar todos los módulos de Chart.js de una vez
Chart.register(...registerables);

// Tasa de IVA aplicada en Colombia
const IVA: number = 0.19;

// Colores neón con buen contraste sobre fondo oscuro
const COLORES_GRAFICA: string[] = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#00E676', '#FF5722'
];

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
export class PizzaListComponent implements OnInit, OnDestroy, AfterViewInit {
  pizzas: Pizza[] = [];
  variantesSeleccionadas: Record<number, VariantePrecio> = {};
  cantidadesSeleccionadas: Record<number, number> = {};
  carrito: ItemCarrito[] = [];
  total: number = 0;
  cargando: boolean = true;
  error: string | null = null;
  enviando: boolean = false;
  pedidoConfirmado: boolean = false;
  historial: PedidoHistorial[] = [];
  cargandoHistorial: boolean = false;

  private graficaInstancia: Chart | null = null;

  constructor(
    private pizzaService: PizzaService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Devuelve true si el usuario tiene rol admin
  get esAdmin(): boolean {
    return this.authService.obtenerUsuario()?.rol === 'admin';
  }

  ngOnInit(): void {
    this.pizzaService.obtenerPizzas().subscribe({
      next: (pizzas: Pizza[]) => {
        this.pizzas = pizzas;
        pizzas.forEach(p => {
          if (p.variantes.length > 0) this.variantesSeleccionadas[p.id] = p.variantes[0];
          this.cantidadesSeleccionadas[p.id] = 1;
        });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = `Error ${err.status || 'de conexión'}: No se pudieron cargar las pizzas.`;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });

    if (this.esAdmin) this.cargarHistorial();
  }

  ngAfterViewInit(): void {
    // Si ya hay historial cargado (ej. recarga), renderizar la gráfica
    if (this.esAdmin && !this.cargandoHistorial && this.historial.length > 0) {
      setTimeout(() => this.renderizarGrafica(), 0);
    }
  }

  ngOnDestroy(): void {
    this.graficaInstancia?.destroy();
  }

  cambiarVariante(pizzaId: number, tamano: string): void {
    const pizza = this.pizzas.find(p => p.id === pizzaId);
    const variante = pizza?.variantes.find(v => v.tamano === tamano);
    if (variante) this.variantesSeleccionadas[pizzaId] = variante;
  }

  calcularSubtotalFila(pizzaId: number): number {
    const variante = this.variantesSeleccionadas[pizzaId];
    const cantidad = this.cantidadesSeleccionadas[pizzaId] ?? 1;
    return variante ? variante.precio * cantidad : 0;
  }

  agregarAlCarrito(pizza: Pizza): void {
    const variante = this.variantesSeleccionadas[pizza.id];
    const cantidad = this.cantidadesSeleccionadas[pizza.id] ?? 1;
    if (!variante || cantidad < 1) return;

    const idx = this.carrito.findIndex(
      i => i.pizza.id === pizza.id && i.variante.tamano === variante.tamano
    );
    this.carrito = idx >= 0
      ? this.carrito.map((i, n) => n === idx ? { ...i, cantidad: i.cantidad + cantidad } : i)
      : [...this.carrito, { pizza, variante, cantidad }];

    this.cantidadesSeleccionadas[pizza.id] = 1;
    this.recalcularTotal();
  }

  eliminarDelCarrito(indice: number): void {
    this.carrito = this.carrito.filter((_, i) => i !== indice);
    this.recalcularTotal();
  }

  private recalcularTotal(): void {
    const subtotal = this.carrito.reduce((acc, i) => acc + i.variante.precio * i.cantidad, 0);
    this.total = subtotal * (1 + IVA);
  }

  finalizarPedido(): void {
    if (this.carrito.length === 0) return;
    if (!this.authService.estaAutenticado()) { this.router.navigate(['/login']); return; }
    this.enviando = true;

    const payload = this.carrito.map(i => ({
      nombre: i.pizza.nombre, tamano: i.variante.tamano,
      cantidad: i.cantidad, precio: i.variante.precio
    }));

    this.pizzaService.enviarPedido(payload, this.total).subscribe({
      next: () => {
        this.pedidoConfirmado = true;
        this.carrito = []; this.total = 0; this.enviando = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.pedidoConfirmado = false; this.cdr.detectChanges(); }, 4000);
      },
      error: () => { this.enviando = false; this.cdr.detectChanges(); }
    });
  }

  // Carga historial y renderiza la gráfica usando getElementById
  // (evita el problema de @ViewChild con *ngIf)
  cargarHistorial(): void {
    this.cargandoHistorial = true;
    this.pizzaService.obtenerHistorial().subscribe({
      next: (pedidos: PedidoHistorial[]) => {
        this.historial = pedidos.slice().reverse();
        this.cargandoHistorial = false;
        this.cdr.detectChanges();
        // Esperar dos ciclos para que el *ngIf pinte el canvas en el DOM
        setTimeout(() => this.renderizarGrafica(), 200);
      },
      error: () => { this.cargandoHistorial = false; this.cdr.detectChanges(); }
    });
  }

  // Cuenta unidades vendidas por nombre de pizza
  private calcularDatosGrafica(): { etiquetas: string[]; valores: number[] } {
    const conteo: Record<string, number> = {};
    this.historial.forEach(p =>
      p.items.forEach(i => { conteo[i.nombre] = (conteo[i.nombre] ?? 0) + i.cantidad; })
    );
    return { etiquetas: Object.keys(conteo), valores: Object.values(conteo) };
  }

  // Renderiza la gráfica usando getElementById para evitar problemas con *ngIf
  private renderizarGrafica(): void {
    const canvas = document.getElementById('graficaVentas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const { etiquetas, valores } = this.calcularDatosGrafica();
    if (etiquetas.length === 0) return;

    this.graficaInstancia?.destroy();

    this.graficaInstancia = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: etiquetas,
        datasets: [{
          data: valores,
          backgroundColor: COLORES_GRAFICA.slice(0, etiquetas.length),
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#f5f5f5',
              font: { size: 13, weight: 'bold' },
              padding: 18,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx: TooltipItem<'pie'>) => ` ${ctx.label}: ${ctx.parsed} unidades`
            }
          }
        }
      }
    });
  }

  totalAcumulado(): number {
    return this.historial.reduce((acc, p) => acc + p.total, 0);
  }

  generarDetalle(pedido: PedidoHistorial): string {
    return pedido.items.map(i => `${i.nombre} (${i.tamano}) x${i.cantidad}`).join(', ');
  }

  formatearMoneda(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', minimumFractionDigits: 0
    }).format(precio);
  }
}
