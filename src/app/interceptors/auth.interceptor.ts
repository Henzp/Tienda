import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // ✅ RUTAS PÚBLICAS - NO requieren token
    const rutasPublicas = [
      '/productos',
      '/categorias', 
      '/contacto',
      '/auth/login',
      '/auth/register'
    ];
    
    // Verificar si la petición es a una ruta pública
    const esRutaPublica = rutasPublicas.some(ruta => request.url.includes(ruta));
    
    // ✅ SOLO añadir token a rutas PRIVADAS
    if (!esRutaPublica) {
      const token = this.authService.obtenerToken();
      
      if (token) {
        console.log('Añadiendo token a petición privada:', request.url);
        
        // Clonar la petición y añadir el encabezado de autorización
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        console.log('⚠️ Petición privada sin token:', request.url);
      }
    } else {
      console.log('✅ Petición pública (sin token):', request.url);
    }
    
    // Manejar la respuesta y capturar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 Unauthorized, el token ha expirado o es inválido
        if (error.status === 401) {
          console.log('❌ Error 401: Token inválido o expirado');
          
          // Solo hacer logout si NO es una ruta pública
          if (!esRutaPublica) {
            this.authService.logout();
            this.router.navigate(['/login'], { 
              queryParams: { returnUrl: this.router.url, expired: 'true' } 
            });
          }
        }
        
        return throwError(() => error);
      })
    );
  }
}