// Interfaz para representar una Pizza en el sistema.
// Esta interfaz define la estructura de datos para una pizza
// del menú de la pizzería, siguiendo el modelo de Python.
// Autor: Camilo Martinez
// Fecha: 19/03/2026

export interface Pizza {
  // Identificador único de la pizza
  id: number;
  
  // Nombre de la pizza (ej. "Hawaiana", "Pepperoni")
  nombre: string;
  
  // Descripción de ingredientes
  descripcion: string;
  
  // Precio base de la pizza (tamaño mediana)
  precioBase: number;
  
  // URL o ruta de la imagen (opcional)
  imagen?: string;
  
  // Si la pizza está disponible para pedidos
  activo: boolean;
}