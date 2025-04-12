import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuarioGuardado();
  }

  cargarUsuarioGuardado() {
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioSubject.next(usuario);
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error);
        this.logout();
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  registro(nombre: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, { nombre, email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            this.usuarioSubject.next(response.usuario);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogueado(): boolean {
    return !!this.obtenerToken();
  }

  esAdmin(): boolean {
    const usuario = this.usuarioSubject.value;
    return usuario && usuario.rol === 'admin';
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/perfil`);
  }
}