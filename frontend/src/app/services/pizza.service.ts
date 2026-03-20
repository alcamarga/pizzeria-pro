// Servicio para obtener las pizzas del backend.
// Este servicio maneja las peticiones HTTP al endpoint
// del backend Python para obtener la lista de pizzas.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pizza } from '../models/pizza';

// URLs del backend API
const API_URL = 'http://127.0.0.1:5000/api/pizzas';
const API_PEDIDOS_URL = 'http://127.0.0.1:5000/api/pedidos';

// Interfaz para la respuesta del endpoint de pizzas
interface PizzasResponse {
  pizzas: Pizza[];
  status: string;
}

// Interfaz para el cuerpo del pedido enviado al backend
interface PedidoPayload {
  pizzas: Pizza[];
  total: number;
}

// Interfaz para la respuesta del endpoint de pedidos
interface PedidoResponse {
  status: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class PizzaService {
  private http = inject(HttpClient);

  // Obtiene la lista de pizzas disponibles desde el backend.
  obtenerPizzas(): Observable<Pizza[]> {
    return this.http.get<PizzasResponse>(API_URL).pipe(
      map((response: PizzasResponse) => response.pizzas)
    );
  }

  // Envía el pedido al backend con la lista de pizzas y el total.
  enviarPedido(pizzas: Pizza[], total: number): Observable<PedidoResponse> {
    const payload: PedidoPayload = { pizzas, total };
    return this.http.post<PedidoResponse>(API_PEDIDOS_URL, payload);
  }
}