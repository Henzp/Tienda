import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  dropdownVisible = false;
  nombreUsuario: string = '';
  totalItems: number = 0;
  
  // Suscripciones para manejar la limpieza
  private usuarioSubscription?: Subscription;
  private carritoSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // Suscripción al usuario
    this.usuarioSubscription = this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.nombre;
      } else {
        this.nombreUsuario = '';
      }
    });
    
    // Suscripción al carrito
    this.carritoSubscription = this.carritoService.getTotalItems().subscribe(total => {
      this.totalItems = total;
    });
  }
  
  // Limpiar suscripciones al destruir el componente
  ngOnDestroy() {
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }

  buscar() {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.router.navigate(['/productos'], { 
        queryParams: { busqueda: this.searchTerm.trim() } 
      });
    }
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  
  // Cerrar el dropdown
  cerrarDropdown() {
    this.dropdownVisible = false;
  }

  // Método para manejar navegación
  navegar(ruta: string) {
    console.log('Navegando a:', ruta);
    this.cerrarDropdown();
    
    if (ruta === '/pedidos') {
      console.log('Verificando autenticación antes de navegar a pedidos');
      if (!this.authService.estaLogueado()) {
        console.log('No autenticado, redirigiendo a login');
        this.router.navigate(['/login'], { queryParams: { returnUrl: ruta } });
        return;
      }
    }
    
    // Navegación con pequeño retraso para asegurar que el dropdown se cierre
    setTimeout(() => {
      this.router.navigate([ruta]);
    }, 100);
  }

  // Método para cerrar sesión
  cerrarSesion() {
    this.cerrarDropdown();
    this.authService.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown');
    
    if (dropdown && !dropdown.contains(targetElement)) {
      this.dropdownVisible = false;
    }
  }
}