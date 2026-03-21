// Servicio para gestionar pizzas y pedidos del backend.
// Autor: Camilo Martinez
// Fecha: 20/03/2026

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pizza } from '../models/pizza';
import { environment } from '../../environments/environment';

// URLs del backend API
const API_PIZZAS_URL: string = `${environment.apiUrl}/pizzas`;
const API_PEDIDOS_URL: string = `${environment.apiUrl}/pedidos`;

// Interfaz para la respuesta del endpoint de pizzas
interface PizzasResponse {
  pizzas: Pizza[];
  status: string;
}

// Interfaz para un item dentro de un pedido del historial
export interface ItemHistorial {
  nombre: string;
  tamano: string;
  cantidad: number;
  precio: number;
}

// Interfaz para un pedido del historial
export interface PedidoHistorial {
  id: number;
  fecha_hora: string;
  items: ItemHistorial[];
  subtotal: number;
  iva: number;
  total: number;
}

// Interfaz para la respuesta del historial de pedidos
interface HistorialResponse {
  pedidos: PedidoHistorial[];
  total_pedidos: number;
}

// Interfaz para el cuerpo del pedido enviado al backend
interface PedidoPayload {
  items: object[];
  total: number;
}

// Interfaz para la respuesta al enviar un pedido
interface PedidoResponse {
  status: string;
  mensaje: string;
  id_pedido: number;
}

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private http = inject(HttpClient);

  // Obtiene la lista de pizzas disponibles desde el backend.
  obtenerPizzas(): Observable<Pizza[]> {
    return this.http.get<PizzasResponse>(API_PIZZAS_URL).pipe(
      map((response: PizzasResponse) => response.pizzas)
    );
  }

  // Envía el pedido al backend con los items detallados y el total.
  enviarPedido(items: object[], total: number): Observable<PedidoResponse> {
    const payload: PedidoPayload = { items, total };
    return this.http.post<PedidoResponse>(API_PEDIDOS_URL, payload);
  }

  // Obtiene el historial completo de pedidos guardados en el backend.
  obtenerHistorial(): Observable<PedidoHistorial[]> {
    return this.http.get<HistorialResponse>(API_PEDIDOS_URL).pipe(
      map((response: HistorialResponse) => response.pedidos)
    );
  }
}
