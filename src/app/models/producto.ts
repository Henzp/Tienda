// src/app/models/producto.ts
export interface Producto {
  _id?: string;  // ID de MongoDB
  id?: number;   // ID antiguo (para compatibilidad)
  nombre: string;
  descripcion: string;
  descripcionLarga?: string;
  precio: number;
  imagenUrl: string;
  imagenesAdicionales?: string[];
  categoria: string;
  subcategoria?: string;
  destacado?: boolean;
  sku?: string;
  marca?: string;
  stock?: number;
}