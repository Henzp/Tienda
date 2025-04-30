import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();
  
  // Añadir esta propiedad para redireccionamiento
  public redirectUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Cargar usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.usuarioSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Guardar token y datos del usuario
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { nombre, email, password });
  }

  logout(): void {
    // Limpiar localStorage y estado
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }

  // Método para obtener el usuario actual
  getCurrentUser(): any {
    return this.usuarioSubject.value;
  }

  // Método para verificar si el usuario es admin
  esAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.rol === 'admin';
  }

  // Actualizar perfil del usuario
  actualizarPerfil(userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/perfil`, userData)
      .pipe(
        tap(response => {
          if (response && response.usuario) {
            // Actualizar localStorage y estado
            localStorage.setItem('currentUser', JSON.stringify(response.usuario));
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  // Cambiar contraseña
  cambiarPassword(passwordData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/password`, passwordData);
  }
}