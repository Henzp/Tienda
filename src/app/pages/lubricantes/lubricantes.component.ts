import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-lubricantes',
  templateUrl: './lubricantes.component.html',
  styleUrls: ['./lubricantes.component.css']
})
export class LubricantesComponent implements OnInit {
  lubricantes: Producto[] = [];
  lubricantesFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Usar el nuevo método getProductosPorCategoria
    this.productoService.getProductosPorCategoria('Lubricantes').subscribe(productos => {
      this.lubricantes = productos;
      this.lubricantesFiltrados = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.lubricantesFiltrados = this.lubricantes;
    } else {
      this.lubricantesFiltrados = this.lubricantes.filter(p => p.marca === marca);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}