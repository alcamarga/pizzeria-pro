// Interfaz para representar un Pedido en el sistema.
// Esta interfaz define la estructura de datos para un pedido
// completo, incluyendo items y cálculos de totales.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

export interface ItemPedido {
  // Referencia a la pizza
  pizzaId: number;
  
  // Referencia al tamaño seleccionado
  tamanoId: number;
  
  // Cantidad de esta pizza en el pedido
  cantidad: number;
  
  // Precio unitario al momento del pedido
  precioUnitario: number;
}

export interface Cliente {
  // Identificador único del cliente
  id: number;
  
  // Nombre del cliente
  nombre: string;
  
  // Teléfono de contacto
  telefono: string;
  
  // Dirección de entrega
  direccion: string;
}

export interface Pedido {
  // Identificador único del pedido
  id?: number;
  
  // Datos del cliente
  cliente?: Cliente;
  
  // Lista de items del pedido
  items?: ItemPedido[];
  
  // Subtotal sin IVA
  subtotal: number;
  
  // IVA calculado (19%)
  iva: number;
  
  // Total con IVA
  total: number;
  
  // Estado del pedido ("Pendiente", "En preparación", "Entregado")
  estado: string;
  
  // Fecha y hora del pedido
  fechaHora?: Date;
}