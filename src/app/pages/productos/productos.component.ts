import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaActual: string = 'todos';
  terminoBusqueda: string = '';

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener categorías
    this.productoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
    
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
    
    // Usar el método buscarProductos del servicio
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
      // Usar el método getProductosPorCategoria
      this.productoService.getProductosPorCategoria(categoria).subscribe(productos => {
        this.productosFiltrados = productos;
      });
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