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
    // Obtener el token de autenticación
    const token = this.authService.obtenerToken();
    
    if (token) {
      console.log('Añadiendo token a la petición:', token.substring(0, 20) + '...');
      
      // Clonar la petición y añadir el encabezado de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.log('No hay token disponible para la petición:', request.url);
    }
    
    // Manejar la respuesta y capturar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 Unauthorized, el token ha expirado o es inválido
        if (error.status === 401) {
          console.log('Error 401: Token inválido o expirado');
          
          // Limpiar el almacenamiento y redirigir al login
          this.authService.logout();
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: this.router.url, expired: 'true' } 
          });
        }
        
        return throwError(() => error);
      })
    );
  }
}