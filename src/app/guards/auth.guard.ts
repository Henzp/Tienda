import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('AuthGuard: Verificando acceso a ruta:', state.url);
    
    // Verificar autenticación
    if (this.authService.estaLogueado()) {
      console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
      return true;
    }
    
    // Guardar URL para redirección post-login
    this.authService.redirectUrl = state.url;
    console.log('AuthGuard: No autenticado, redirigiendo a login. URL guardada:', state.url);
    
    // Redirigir al login con la URL de retorno
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    
    return false;
  }
}