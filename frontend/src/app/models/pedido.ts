// Interfaz para la gestión de pedidos y clientes.
// Autor: Camilo Martinez | Fecha: 23/03/2026 | Versión: 4.1

export interface ArticuloPedido {
  pizzaId: number;
  tamanoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Pedido {
  id?: number;
  cliente?: Cliente;
  articulos: ArticuloPedido[]; // Cambiado de 'items' a 'articulos'
  subtotal: number;
  iva: number;
  total: number;
  estado: 'Pendiente' | 'En preparación' | 'Entregado';
  fechaHora?: Date;
}