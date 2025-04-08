import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriaActual: string = 'todos';
  terminoBusqueda: string = '';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar todos los productos
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
      
      // Suscribirse a cambios en los parámetros de la URL
      this.route.queryParams.subscribe(params => {
        if (params['busqueda']) {
          this.terminoBusqueda = params['busqueda'];
          this.buscarProductos(this.terminoBusqueda);
        } else {
          // Si no hay búsqueda, aplicar el filtro de categoría
          this.filtrarPorCategoria(this.categoriaActual);
        }
      });
    });
  }

  buscarProductos(termino: string): void {
    this.terminoBusqueda = termino;
    this.productoService.buscarProductos(termino).subscribe(resultados => {
      this.productosFiltrados = resultados;
    });
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaActual = categoria;
    this.terminoBusqueda = ''; // Limpiar término de búsqueda
    
    if (categoria === 'todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        producto => producto.categoria === categoria
      );
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.filtrarPorCategoria(this.categoriaActual);
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}