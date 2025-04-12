// services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Función auxiliar para convertir _id a id para compatibilidad
  private convertirIds(productos: any[]): Producto[] {
    return productos.map(p => {
      return { ...p, id: p._id };  // Añadir id basado en _id para compatibilidad
    });
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`).pipe(
      map(productos => this.convertirIds(productos))
    );
  }

  getProductoById(id: string | number): Observable<Producto | undefined> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`).pipe(
      map(producto => producto ? { ...producto, id: producto._id } : undefined)
    );
  }

  getProductosPorCategoria(categoria: string): Observable<Producto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/categoria/${categoria}`).pipe(
      map(productos => this.convertirIds(productos))
    );
  }

  getProductosPorSubcategoria(subcategoria: string): Observable<Producto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/subcategoria/${subcategoria}`).pipe(
      map(productos => this.convertirIds(productos))
    );
  }

  getProductosDestacados(): Observable<Producto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/destacados`).pipe(
      map(productos => this.convertirIds(productos))
    );
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/productos/categorias/lista`);
  }

  getSubcategoriasRepuestos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/productos/subcategorias/repuestos`);
  }

  buscarProductos(termino: string): Observable<Producto[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`).pipe(
      map(productos => this.convertirIds(productos)),
      map(productos => 
        productos.filter(p => 
          p.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(termino.toLowerCase()) ||
          p.categoria.toLowerCase().includes(termino.toLowerCase()) ||
          (p.marca && p.marca.toLowerCase().includes(termino.toLowerCase()))
        )
      )
    );
  }
}