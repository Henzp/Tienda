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
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';
  tipoActual: string = 'todos';

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productoService.getProductos().subscribe(productos => {
      // Filtrar solo los productos de categoría 'Repuestos'
      this.repuestos = productos.filter(producto => 
        producto.categoria === 'Repuestos'
      );
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.repuestos.map(repuesto => repuesto.marca || 'Sin marca'))];
      
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

  filtrarPorMarca(marca: string): void {
    this.marcaSeleccionada = marca;
    this.aplicarFiltros();
  }

  filtrarPorTipo(tipo: string): void {
    this.tipoActual = tipo;
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    // Comenzar con todos los repuestos
    let resultados = this.repuestos;
    
    // Aplicar filtro de tipo si no es 'todos'
    if (this.tipoActual !== 'todos') {
      resultados = resultados.filter(repuesto => repuesto.subcategoria === this.tipoActual);
    }
    
    // Aplicar filtro de marca si no es 'todas'
    if (this.marcaSeleccionada !== 'todas') {
      resultados = resultados.filter(repuesto => repuesto.marca === this.marcaSeleccionada);
    }
    
    this.repuestosFiltrados = resultados;
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}