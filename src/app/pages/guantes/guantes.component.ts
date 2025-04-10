import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

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
    // Cargar productos de la categoría Guantes
    this.productoService.getProductosPorCategoria('Guantes').subscribe(productos => {
      this.guantes = productos;
      this.guantesFiltrados = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.guantesFiltrados = this.guantes;
    } else {
      this.guantesFiltrados = this.guantes.filter(p => p.marca === marca);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}