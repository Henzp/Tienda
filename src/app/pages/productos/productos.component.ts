// productos.component.ts
import { Component, OnInit } from '@angular/core';
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
  categoriaActual: string = 'todos';

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.productosFiltrados = productos;
    });
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaActual = categoria;
    
    if (categoria === 'todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        producto => producto.categoria === categoria
      );
    }
  }

  verDetalles(id: number): void {
    // Por ahora solo mostramos un alert, luego lo mejoraremos con una página de detalles
    alert(`Ver detalles del producto ${id}`);
  }
}