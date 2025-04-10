import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  categorias: string[] = [];
  // Estilo de fondo para el banner principal
heroBackgroundStyle: string = 'url("assets/moto-hero.jpg")';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargar productos destacados
    this.productoService.getProductosDestacados().subscribe(productos => {
      this.productosDestacados = productos;
    });
    
    // Cargar categorías disponibles para mostrar en navegación
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