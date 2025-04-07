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
      precio: 89990,
      imagenUrl: 'assets/casco.jpg',
      categoria: 'Cascos',
      destacado: true
    },
    {
      id: 2,
      nombre: 'Guantes de Cuero',
      descripcion: 'Guantes de cuero para protección y agarre',
      precio: 29990,
      imagenUrl: 'assets/guantes.jpg',
      categoria: 'Guantes',
      destacado: true
    },
    {
      id: 3,
      nombre: 'Neumático Continental',
      descripcion: 'Neumático de alta calidad para todo tipo de terreno',
      precio: 79990,
      imagenUrl: 'assets/neumaticos.jpg',
      categoria: 'Neumáticos',
      destacado: true
    },
    {
      id: 4,
      nombre: 'Manillas Led',
      descripcion: 'Manillas con luz led para mayor visibilidad',
      precio: 19990,
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
}