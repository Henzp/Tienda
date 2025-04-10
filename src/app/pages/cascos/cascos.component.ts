import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-cascos',
  templateUrl: './cascos.component.html',
  styleUrls: ['./cascos.component.css']
})
export class CascosComponent implements OnInit {
  cascos: Producto[] = [];
  cascosFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar productos de la categoría Cascos
    this.productoService.getProductosPorCategoria('Cascos').subscribe(productos => {
      this.cascos = productos;
      this.cascosFiltrados = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.cascosFiltrados = this.cascos;
    } else {
      this.cascosFiltrados = this.cascos.filter(p => p.marca === marca);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}