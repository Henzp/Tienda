import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';

  constructor(private router: Router) {}

  buscar(): void {
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      // Navegar a la página de productos con el término de búsqueda
      this.router.navigate(['/productos'], { 
        queryParams: { busqueda: this.searchTerm.trim() } 
      });
    }
  }
}