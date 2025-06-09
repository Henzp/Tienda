import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-accesorios',
  templateUrl: './accesorios.component.html',
  styleUrls: ['./accesorios.component.css']
})
export class AccesoriosComponent implements OnInit {
  accesorios: any[] = [];
  accesoriosFiltrados: any[] = [];
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';
  cargando: boolean = true;
  error: string = '';

  constructor(
    private productoService: ProductoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargamos todos los productos y filtramos por categoría
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        // Filtramos manualmente por categoría
        this.accesorios = productos.filter(p => 
          p.categoria && p.categoria.toLowerCase() === 'accesorios'.toLowerCase()
        );
        this.accesoriosFiltrados = [...this.accesorios];
        
        // Extraer marcas únicas
        const marcasSet = new Set<string>();
        this.accesorios.forEach(p => {
          if (p.marca) marcasSet.add(p.marca);
        });
        this.marcas = Array.from(marcasSet);
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('ERROR', error);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
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

  verDetalles(id: any): void {
    if (id) {
      this.router.navigate(['/producto', id]);
    }
  }
}