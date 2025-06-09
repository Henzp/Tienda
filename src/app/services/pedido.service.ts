// Este es el contenido para el archivo: E:\Proyecto\tienda\src\app\services\pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
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
        // Si hay error, intentar cargar de localStorage
        return this.getPedidosLocalesPorUsuario();
      })
    );
  }

  /**
   * Obtiene pedidos del usuario actual desde localStorage (fallback)
   */
  private getPedidosLocalesPorUsuario(): Observable<any[]> {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      const usuarioActual = this.authService.getCurrentUser();
      
      if (usuarioActual && usuarioActual.email) {
        const pedidosUsuario = pedidosGuardados.filter((pedido: any) => 
          pedido.datosEnvio && pedido.datosEnvio.email === usuarioActual.email
        );
        return of(pedidosUsuario);
      }
      
      return of([]);
    } catch (error) {
      console.error('Error al cargar pedidos desde localStorage:', error);
      return of([]);
    }
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
        // Si hay error, intentar cargar de localStorage
        return this.getPedidoLocal(id);
      })
    );
  }

  /**
   * Obtiene un pedido específico desde localStorage (fallback)
   * @param id ID del pedido
   */
  private getPedidoLocal(id: string): Observable<any> {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      const pedido = pedidosGuardados.find((p: any) => p._id === id);
      
      if (pedido) {
        return of(pedido);
      }
      
      return throwError(() => new Error('Pedido no encontrado'));
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Obtiene todos los pedidos (solo para administradores)
   */
  getTodosPedidos(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    
    return this.http.get<any[]>(`${this.apiUrl}/pedidos/todos`, { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener todos los pedidos:', error);
        // Si hay error, intentar cargar de localStorage
        return this.getTodosPedidosLocales();
      })
    );
  }

  /**
   * Obtiene todos los pedidos desde localStorage (fallback)
   */
  private getTodosPedidosLocales(): Observable<any[]> {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      return of(pedidosGuardados);
    } catch (error) {
      console.error('Error al cargar todos los pedidos desde localStorage:', error);
      return of([]);
    }
  }

  /**
   * Actualiza el estado de un pedido
   * @param id ID del pedido
   * @param estado Nuevo estado
   */
  actualizarEstadoPedido(id: string, estado: string): Observable<any> {
    const headers = this.getAuthHeaders();
    
    return this.http.put<any>(`${this.apiUrl}/pedidos/${id}/estado`, { estado }, { headers }).pipe(
      tap(response => console.log('Estado del pedido actualizado:', response)),
      catchError(error => {
        console.error('Error al actualizar estado del pedido:', error);
        // Si hay error, intentar actualizar en localStorage
        return this.actualizarEstadoPedidoLocal(id, estado);
      })
    );
  }

  /**
   * Actualiza el estado de un pedido en localStorage (fallback)
   * @param id ID del pedido
   * @param estado Nuevo estado
   */
  private actualizarEstadoPedidoLocal(id: string, estado: string): Observable<any> {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      const index = pedidosGuardados.findIndex((p: any) => p._id === id);
      
      if (index !== -1) {
        pedidosGuardados[index].estado = estado;
        localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));
        return of({ mensaje: 'Estado actualizado localmente', pedido: pedidosGuardados[index] });
      }
      
      return throwError(() => new Error('Pedido no encontrado'));
    } catch (error) {
      return throwError(() => error);
    }
  }
}