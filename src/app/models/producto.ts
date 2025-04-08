export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  categoria: string;
  subcategoria?: string; // Añadir este campo para clasificar los repuestos
  destacado?: boolean;
  sku?: string;
  marca?: string;
  descripcionLarga?: string;
  imagenesAdicionales?: string[];
}