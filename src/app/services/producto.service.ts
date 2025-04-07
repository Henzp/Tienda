// services/producto.service.ts
import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Por ahora usaremos datos mock, luego podrás reemplazarlos con una API
  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'Casco Integral',
      descripcion: 'Casco integral para máxima protección en moto',
      precio: 189990,
      imagenUrl: 'assets/casco.jpg',
      categoria: 'Cascos',
      destacado: true
    },
    {
      id: 2,
      nombre: 'Guantes de Cuero',
      descripcion: 'Guantes de cuero para protección y agarre',
      precio: 79990,
      imagenUrl: 'assets/guantes.jpg',
      categoria: 'Guantes',
      destacado: true
    },
    {
      id: 3,
      nombre: 'Neumático Continental',
      descripcion: 'Neumático de alta calidad para todo tipo de terreno',
      precio: 132900,
      imagenUrl: 'assets/neumaticos.jpg',
      categoria: 'Neumáticos',
      destacado: true
    },
    {
      id: 4,
      nombre: 'Manillas Led',
      descripcion: 'Manillas con luz led para mayor visibilidad',
      precio: 128900,
      imagenUrl: 'assets/manillas.jpg',
      categoria: 'Accesorios',
      destacado: false
    }
  ];

  constructor() { }

  getProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  getProductoById(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto);
  }

  getProductosDestacados(): Observable<Producto[]> {
    return of(this.productos.filter(producto => producto.destacado));
  }
  // Copia y pega este método en tu producto.service.ts justo antes del último corchete de cierre

buscarProductos(termino: string): Observable<Producto[]> {
  if (!termino || termino.trim() === '') {
    // Si no hay término de búsqueda, devuelve todos los productos
    return of(this.productos);
  }
  
  // Convierte el término a minúsculas para una búsqueda no sensible a mayúsculas
  const terminoLower = termino.toLowerCase();
  
  // Filtra productos que coincidan con el término en nombre, descripción o categoría
  const resultados = this.productos.filter(producto => 
    producto.nombre.toLowerCase().includes(terminoLower) ||
    producto.descripcion.toLowerCase().includes(terminoLower) ||
    producto.categoria.toLowerCase().includes(terminoLower)
  );
  
  return of(resultados);
}
}