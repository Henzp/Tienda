// models/producto.ts
export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagenUrl: string;
    categoria: string;
    destacado?: boolean;
    sku?: string;
    marca?: string;
  }