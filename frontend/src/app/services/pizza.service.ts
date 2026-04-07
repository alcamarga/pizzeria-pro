// Servicio para gestionar el catálogo y los pedidos.
// Autor: Camilo Martinez | Fecha: 23/03/2026 | Versión: 4.1

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Pizza } from '../models/pizza';
import { environment } from '../../environments/environment';

const URL_API_PIZZAS: string = `${environment.apiUrl}/pizzas`;
const URL_API_PEDIDOS: string = `${environment.apiUrl}/pedidos`;
const URL_API_MIS_PEDIDOS: string = `${environment.apiUrl}/pedidos/mis`;

export interface ArticuloHistorial {
  nombre: string;
  tamano: string;
  cantidad: number;
  precio: number;
}

export interface RegistroPedido {
  id: number;
  fecha_hora: string;
  articulos: ArticuloHistorial[];
  subtotal: number;
  iva: number;
  total: number;
}

interface RespuestaPizzas {
  pizzas: Pizza[];
  status: string;
}

interface RespuestaHistorial {
  pedidos: RegistroPedido[];
  total_pedidos: number;
}

interface CargaUtilPedido {
  items: any[]; // Se recomienda crear una interfaz 'ArticuloCarrito'
  total: number;
}

interface RespuestaEnvioPedido {
  status: string;
  mensaje: string;
  id_pedido: number;
}

@Injectable({ providedIn: 'root' })
export class PizzaService {
  private http = inject(HttpClient);

  obtenerCatalogoPizzas(): Observable<Pizza[]> {
    return this.http.get<RespuestaPizzas>(URL_API_PIZZAS).pipe(
      map((respuesta: RespuestaPizzas) => respuesta.pizzas)
    );
  }

  enviarNuevoPedido(articulos: any[], totalPedido: number): Observable<RespuestaEnvioPedido> {
    const cuerpoPedido: CargaUtilPedido = { items: articulos, total: totalPedido };
    return this.http.post<RespuestaEnvioPedido>(URL_API_PEDIDOS, cuerpoPedido);
  }

  /** Panel admin: todos los pedidos (requiere JWT con rol admin). */
  obtenerHistorialVentasAdmin(): Observable<RegistroPedido[]> {
    return this.http.get<RespuestaHistorial>(URL_API_PEDIDOS).pipe(
      map((respuesta: RespuestaHistorial) => respuesta.pedidos)
    );
  }

  /** Historial del usuario autenticado. */
  obtenerMisPedidos(): Observable<RegistroPedido[]> {
    return this.http.get<RespuestaHistorial>(URL_API_MIS_PEDIDOS).pipe(
      map((respuesta: RespuestaHistorial) => respuesta.pedidos)
    );
  }
}