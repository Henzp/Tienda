import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-diagnostico',
  templateUrl: './diagnostico.component.html',
  styleUrls: ['./diagnostico.component.css']
})
export class DiagnosticoComponent implements OnInit {
  totalProductos: number = 0;
  categorias: string[] = [];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    // No hacemos nada al iniciar
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.totalProductos = productos.length;
        console.log('Productos cargados:', productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.totalProductos = 0;
      }
    });
  }

  cargarCategorias(): void {
    this.productoService.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
        console.log('Categorías:', cats);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.categorias = [];
      }
    });
  }
}