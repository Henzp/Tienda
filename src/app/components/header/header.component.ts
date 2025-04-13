// header.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchTerm: string = ''; // Añadido para el input de búsqueda
  dropdownVisible = false;
  nombreUsuario: string = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.nombreUsuario = usuario.nombre;
      }
    });
  }

  // Método para manejar la búsqueda
  buscar() {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Puedes implementar la navegación a los resultados de búsqueda
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