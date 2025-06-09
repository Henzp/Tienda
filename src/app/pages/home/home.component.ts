import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  categorias: string[] = [];
  // Añadimos la opacidad directamente en el estilo del fondo
  heroBackgroundStyle: string = 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("assets/banner-principal.jpg")';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar productos destacados
    this.productoService.getProductosDestacados().subscribe(productos => {
      this.productosDestacados = productos;
    });
    
    // Cargar categorías disponibles
    this.productoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }

  irACategoria(categoria: string): void {
    // Convertir el nombre de la categoría para la URL
    let categoriaUrl = categoria.toLowerCase();
    
    // Ajustar acentos si es necesario
    if (categoriaUrl === 'neumáticos') {
      categoriaUrl = 'neumaticos';
    }
    
    this.router.navigate(['/' + categoriaUrl]);
  }
}