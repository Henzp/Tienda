import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-neumaticos',
  templateUrl: './neumaticos.component.html',
  styleUrls: ['./neumaticos.component.css']
})
export class NeumaticosComponent implements OnInit {
  neumaticos: Producto[] = [];
  neumaticosFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Usar el nuevo método getProductosPorCategoria
    this.productoService.getProductosPorCategoria('Neumáticos').subscribe(productos => {
      this.neumaticos = productos;
      this.neumaticosFiltrados = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.neumaticosFiltrados = this.neumaticos;
    } else {
      this.neumaticosFiltrados = this.neumaticos.filter(p => p.marca === marca);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}