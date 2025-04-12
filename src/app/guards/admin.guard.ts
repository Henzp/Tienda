import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.authService.estaLogueado() && this.authService.esAdmin()) {
      return true;
    }
    
    // Si no es admin o no está logueado, redirigir al login
    this.router.navigate(['/admin/login']);
    return false;
  }
}