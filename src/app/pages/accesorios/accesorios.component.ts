import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css']
})
export class AccesoriosComponent implements OnInit {
  accesorios: Producto[] = [];

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener todos los productos y filtrar solo los de categoría 'Accesorios'
    this.productoService.getProductos().subscribe(productos => {
      this.accesorios = productos.filter(producto => 
        producto.categoria === 'Accesorios'
      );
    });
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}