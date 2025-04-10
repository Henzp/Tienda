import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-repuestos',
  templateUrl: './repuestos.component.html',
  styleUrls: ['./repuestos.component.css']
})
export class RepuestosComponent implements OnInit {
  repuestos: Producto[] = [];
  repuestosFiltrados: Producto[] = [];
  subcategorias: string[] = [];
  marcas: string[] = [];
  tipoActual: string = 'todos';
  marcaSeleccionada: string = 'todas';

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener subcategorías de repuestos
    this.productoService.getSubcategoriasRepuestos().subscribe(subcategorias => {
      this.subcategorias = subcategorias;
    });
    
    // Obtener todos los repuestos
    this.productoService.getProductosPorCategoria('Repuestos').subscribe(productos => {
      this.repuestos = productos;
      
      // Obtener marcas únicas
      this.marcas = [...new Set(productos
        .filter(p => p.marca)
        .map(p => p.marca as string))];
      
      // Verificar si hay parámetros de tipo en la URL
      this.route.queryParams.subscribe(params => {
        if (params['tipo']) {
          this.tipoActual = params['tipo'];
        } else {
          this.tipoActual = 'todos';
        }
        
        // Aplicar filtros iniciales
        this.aplicarFiltros();
      });
    });
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoActual = tipo;
    this.aplicarFiltros();
  }

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    // Si tipo es 'todos', comenzamos con todos los repuestos
    if (this.tipoActual === 'todos') {
      let resultados = this.repuestos;
      
      // Aplicar filtro de marca si no es 'todas'
      if (this.marcaSeleccionada !== 'todas') {
        resultados = resultados.filter(repuesto => repuesto.marca === this.marcaSeleccionada);
      }
      
      this.repuestosFiltrados = resultados;
    } else {
      // Si tipo no es 'todos', necesitamos obtener los productos por subcategoría
      this.productoService.getProductosPorSubcategoria(this.tipoActual).subscribe(productos => {
        let resultados = productos;
        
        // Aplicar filtro de marca si no es 'todas'
        if (this.marcaSeleccionada !== 'todas') {
          resultados = resultados.filter(repuesto => repuesto.marca === this.marcaSeleccionada);
        }
        
        this.repuestosFiltrados = resultados;
      });
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}