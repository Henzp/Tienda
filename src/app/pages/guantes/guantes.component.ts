import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guantes',
  templateUrl: './guantes.component.html',
  styleUrls: ['./guantes.component.css']
})
export class GuantesComponent implements OnInit {
  guantes: Producto[] = [];
  guantesFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      // Filtrar solo los productos de categoría 'Guantes'
      this.guantes = productos.filter(producto => 
        producto.categoria === 'Guantes'
      );
      
      // Inicialmente mostrar todos los guantes
      this.guantesFiltrados = this.guantes;
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.guantes.map(guante => guante.marca || 'Sin marca'))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.guantesFiltrados = this.guantes;
    } else {
      this.guantesFiltrados = this.guantes.filter(
        guante => guante.marca === marca
      );
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
    // Aquí podrías implementar navegación a página de detalles
  }
}