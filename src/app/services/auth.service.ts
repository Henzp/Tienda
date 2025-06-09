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
  
  // Propiedad para guardar URL de redirección
  public redirectUrl: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicializar la autenticación al cargar el servicio
    this.inicializarAutenticacion();
  }

  // Verificar token y usuario al iniciar
  private inicializarAutenticacion(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('currentUser');
    
    if (token && userData) {
      try {
        const usuario = JSON.parse(userData);
        this.usuarioSubject.next(usuario);
        console.log('Autenticación inicializada con éxito');
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        this.limpiarDatosAutenticacion();
      }
    }
  }

  // Limpiar datos de autenticación
  private limpiarDatosAutenticacion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.usuarioSubject.next(null);
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
            console.log('Login exitoso:', response.usuario);
          }
        })
      );
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, { nombre, email, password });
  }

  logout(): void {
    console.log('Cerrando sesión');
    this.limpiarDatosAutenticacion();
    this.router.navigate(['/login']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método mejorado para verificar autenticación
  estaLogueado(): boolean {
    const token = this.obtenerToken();
    const usuario = this.getCurrentUser();
    const resultado = !!token && !!usuario;
    console.log('¿Usuario autenticado?', resultado);
    return resultado;
  }

  // Método para obtener el usuario actual
  getCurrentUser(): any {
    const usuario = this.usuarioSubject.value;
    if (!usuario) {
      // Intentar recuperar del localStorage si no está en el BehaviorSubject
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          this.usuarioSubject.next(parsedUser);
          return parsedUser;
        } catch (error) {
          console.error('Error al recuperar usuario del localStorage:', error);
          return null;
        }
      }
      return null;
    }
    return usuario;
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