import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css']
})
export class AccesoriosComponent implements OnInit {
  accesorios: Producto[] = [];
  accesoriosFiltrados: Producto[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Usar el nuevo método getProductosPorCategoria
    this.productoService.getProductosPorCategoria('Accesorios').subscribe(productos => {
      this.accesorios = productos;
      this.accesoriosFiltrados = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
    });
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    
    if (marca === 'todas') {
      this.accesoriosFiltrados = this.accesorios;
    } else {
      this.accesoriosFiltrados = this.accesorios.filter(p => p.marca === marca);
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}