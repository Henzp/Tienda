import { Producto } from './producto';

// Este es el contenido para el archivo: E:\Proyecto\tienda\src\app\models\carrito-item.ts
export interface CarritoItem {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
  stockDisponible: number;
}