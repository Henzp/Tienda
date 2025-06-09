import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = `${environment.apiUrl}/admin/categorias`;

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener una categoría por ID
  getCategoria(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear nueva categoría
  crearCategoria(categoriaData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoriaData);
  }

  // Actualizar categoría existente
  actualizarCategoria(id: string, categoriaData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, categoriaData);
  }

  // Eliminar categoría
  eliminarCategoria(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}