// header.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  dropdownVisible = false;
  nombreUsuario: string = '';
  totalItems: number = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.nombre;
      }
    }); // Faltaba este paréntesis de cierre
    
    // Esta suscripción debe estar fuera de la suscripción anterior
    this.carritoService.getTotalItems().subscribe(total => {
      this.totalItems = total;
    });
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

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
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