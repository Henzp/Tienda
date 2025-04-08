import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

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
    this.productoService.getProductos().subscribe(productos => {
      // Filtrar solo los productos de categoría 'Lubricantes'
      this.lubricantes = productos.filter(producto => 
        producto.categoria === 'Lubricantes'
      );
      
      // Inicialmente mostrar todos los lubricantes
      this.lubricantesFiltrados = this.lubricantes;
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.lubricantes.map(lubricante => lubricante.marca || 'Sin marca'))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.lubricantesFiltrados = this.lubricantes;
    } else {
      this.lubricantesFiltrados = this.lubricantes.filter(
        lubricante => lubricante.marca === marca
      );
    }
  }
  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
   
}