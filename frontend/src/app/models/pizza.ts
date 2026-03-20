// Interfaces para el modelo Pizza con variantes de precio por tamaño.
// Autor: Camilo Martinez
// Fecha: 20/03/2026

// Variante de precio según el tamaño de la pizza
export interface VariantePrecio {
  tamano: string;
  precio: number;
}

// Modelo principal de pizza con lista de variantes
export interface Pizza {
  id: number;
  nombre: string;
  descripcion: string;
  variantes: VariantePrecio[];
  imagen?: string;
  activo: boolean;
}
