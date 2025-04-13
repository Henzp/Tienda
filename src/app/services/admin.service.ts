import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Cambiar de private a public
  public apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  // Obtener todos los productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  // Obtener un producto por ID
  getProducto(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id}`);
  }

  // Crear un nuevo producto
  crearProducto(productoData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productos`, productoData);
  }

  // Actualizar un producto existente
  actualizarProducto(id: string, productoData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/productos/${id}`, productoData);
  }

  // Eliminar un producto
  eliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/productos/${id}`);
  }

  // Subir imágenes adicionales
  subirImagenesAdicionales(id: string, imagenesData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/productos/${id}/imagenes`, imagenesData);
  }

  // Obtener todos los usuarios
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  // Obtener un usuario por ID
  getUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  // Actualizar un usuario
  actualizarUsuario(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, userData);
  }

  // Eliminar un usuario
  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }
}