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
    this.productoService.getProductos().subscribe(productos => {
      // Filtrar solo los productos de categoría 'Cascos'
      this.cascos = productos.filter(producto => 
        producto.categoria === 'Cascos'
      );
      
      // Inicialmente mostrar todos los cascos
      this.cascosFiltrados = this.cascos;
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.cascos.map(casco => casco.marca || 'Sin marca'))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.cascosFiltrados = this.cascos;
    } else {
      this.cascosFiltrados = this.cascos.filter(
        casco => casco.marca === marca
      );
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}