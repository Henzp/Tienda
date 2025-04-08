import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-neumaticos',
  templateUrl: './neumaticos.component.html',
  styleUrls: ['./neumaticos.component.css']
})
export class NeumaticosComponent implements OnInit {
  neumaticos: Producto[] = [];
  neumaticosFiltered: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      // Filtrar solo los productos de categoría 'Neumáticos'
      this.neumaticos = productos.filter(producto => 
        producto.categoria === 'Neumáticos'
      );
      
      // Inicialmente mostrar todos los neumáticos
      this.neumaticosFiltered = this.neumaticos;
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.neumaticos.map(neumatico => neumatico.marca || 'Sin marca'))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.neumaticosFiltered = this.neumaticos;
    } else {
      this.neumaticosFiltered = this.neumaticos.filter(
        neumatico => neumatico.marca === marca
      );
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}