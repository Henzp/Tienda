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
      destacado: true,
      sku: '111111',
      marca: 'CASCO'
    },
    {
      id: 2,
      nombre: 'Guantes de Cuero',
      descripcion: 'Guantes de cuero para protección y agarre',
      precio: 79990,
      imagenUrl: 'assets/guantes.jpg',
      categoria: 'Guantes',
      destacado: true,
      sku: '222222',
      marca: 'Marca'
    },
    
    {
      id: 3,
      nombre: 'Manillas ZETA',
      descripcion: 'Manillas',
      precio: 128900,
      imagenUrl: 'assets/accesorios/manillas_zeta.jpg',
      categoria: 'Accesorios',
      destacado: false,
      sku: 'ZS63-0221',
      marca: 'ZETA'
    },
    {
      id: 4,
      nombre: 'Calienta Puños Oxford EVO',
      descripcion: 'Calienta puños',
      precio: 132900,
      imagenUrl: 'assets/accesorios/oxfordevo.jpg',
      categoria: 'Accesorios',
      destacado: false,
      sku: 'MLC994026965',
      marca: 'Oxford'
    },
    {
      id: 5,
      nombre: 'Aceite de Motor Castrol',
      descripcion: '10W 50',
      precio: 21900,
      imagenUrl: 'assets/Aceites/Castrol10w50.jpg',
      categoria: 'Lubricantes',
      destacado: false,
      sku: 'MLC998496228',
      marca: 'Castrol'
    },
    {
      id: 6,
      nombre: 'Contisport attack 120/70zr 17',
      descripcion: '',
      precio: 132900,
      imagenUrl: 'assets/Neumaticos/continental/contisportattack_120-70zr-17.jpg',
      categoria: 'Neumáticos',
      destacado: false,
      sku: 'M02443990000',
      marca: 'Continental'
    },
    {
      id: 7,
      nombre: 'Contimotion 180/55 Zr17 W 73',
      descripcion: 'Neumatico',
      precio: 189900,
      imagenUrl: 'assets/Neumaticos/continental/contimotion_180-55-zr17w73.jpg',
      categoria: 'Neumáticos',
      destacado: false,
      sku: 'MLC1099294133',
      marca: 'Continental'
    },
    {
      id: 8,
      nombre: 'Contisportattack 180/55 Zr17 W 73',
      descripcion: 'Neumatico',
      precio: 188900,
      imagenUrl: 'assets/Neumaticos/continental/contisport-attack_180-55-zr17w73.jpg',
      categoria: 'Neumáticos',
      destacado: false,
      sku: 'MMLC1004828089',
      marca: 'Continental'
    },
    {
      id: 9,
      nombre: 'Contimotion 120/70 Zr17 M/c W 58',
      descripcion: 'Neumatico',
      precio: 128900,
      imagenUrl: 'assets/Neumaticos/continental/contimotion_120-70zr17m-c58w.jpg',
      categoria: 'Neumáticos',
      destacado: false,
      sku: 'MLC18430200',
      marca: 'Continental'
    },
    {
      id: 10,
      nombre: 'GT 601 110/70-17',
      descripcion: 'Neumatico',
      precio: 91900,
      imagenUrl: 'assets/Neumaticos/dunlop/dunlop_gt_601_110-70-17.jpg',
      categoria: 'Neumáticos',
      destacado: false,
      sku: '307339',
      marca: 'Dunlop'
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