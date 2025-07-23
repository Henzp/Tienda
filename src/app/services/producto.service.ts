// services/producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';
import { environment } from '../environments/environment';  // ← AGREGADO

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;  // ← CAMBIADO: Ahora usa environment

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

  // Nueva función para actualizar el stock de un producto
  actualizarStock(productoId: string, cantidad: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/productos/${productoId}/stock`, { cantidad });
  }
  
  // Función para actualizar el stock localmente (para modo simulado)
  actualizarStockLocal(productoId: string, cantidad: number): boolean {
    try {
      // Obtener productos almacenados localmente (si existen)
      const productosLocalStr = localStorage.getItem('productos');
      if (!productosLocalStr) {
        console.error('No hay productos almacenados localmente');
        return false;
      }

      const productosLocal = JSON.parse(productosLocalStr);
      const producto = productosLocal.find((p: any) => (p._id === productoId || p.id === productoId));
      
      if (!producto) {
        console.error(`Producto con ID ${productoId} no encontrado localmente`);
        return false;
      }
      
      // Verificar que hay suficiente stock
      if (producto.stock < cantidad) {
        console.error(`Stock insuficiente para el producto ${producto.nombre}`);
        return false;
      }
      
      // Actualizar el stock
      producto.stock -= cantidad;
      
      // Guardar de nuevo en localStorage
      localStorage.setItem('productos', JSON.stringify(productosLocal));
      console.log(`Stock actualizado para el producto ${producto.nombre}: nuevo stock = ${producto.stock}`);
      return true;
    } catch (error) {
      console.error('Error al actualizar stock localmente:', error);
      return false;
    }
  }
}