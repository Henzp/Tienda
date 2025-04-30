import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Verifica el token antes de hacer la petición
   * @returns HttpHeaders con el token si existe
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.obtenerToken();
    if (!token) {
      console.warn('No hay token disponible para realizar la petición');
      return new HttpHeaders();
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Crea un nuevo pedido
   * @param pedidoData Datos del pedido
   */
  crearPedido(pedidoData: any): Observable<any> {
    // Verificar si hay token disponible
    if (!this.authService.estaLogueado()) {
      console.error('No hay sesión activa para crear el pedido');
      return throwError(() => new Error('No hay sesión activa. Por favor, inicia sesión e intenta nuevamente.'));
    }
    
    const headers = this.getAuthHeaders();
    
    return this.http.post<any>(`${this.apiUrl}/pedidos`, pedidoData, { headers }).pipe(
      tap(response => console.log('Pedido creado:', response)),
      catchError(error => {
        console.error('Error al crear pedido:', error);
        if (error.status === 401) {
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene los pedidos del usuario actual
   */
  getPedidosPorUsuario(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/usuario`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener pedidos del usuario:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un pedido específico por su ID
   * @param id ID del pedido
   */
  getPedido(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<any>(`${this.apiUrl}/pedidos/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener pedido:', error);
        return throwError(() => error);
      })
    );
  }
}