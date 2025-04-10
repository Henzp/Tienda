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
  subcategorias: string[] = []; // Cambiar para usar las subcategorías del servicio
  marcas: string[] = [];
  marcaSeleccionada: string = 'todas';
  tipoActual: string = 'todos';

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener subcategorías de repuestos desde el servicio
    this.productoService.getSubcategoriasRepuestos().subscribe(subcategorias => {
      this.subcategorias = subcategorias;
    });
    
    // Obtener todos los repuestos usando el nuevo método
    this.productoService.getProductosPorCategoria('Repuestos').subscribe(repuestos => {
      this.repuestos = repuestos;
      
      // Obtener las marcas únicas
      this.marcas = [...new Set(this.repuestos
        .filter(r => r.marca) // Solo productos con marca definida
        .map(r => r.marca as string))]; // Convertir a string (ya filtramos los undefined)
      
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
    if (this.tipoActual === 'todos' && this.marcaSeleccionada === 'todas') {
      // Si no hay filtros, mostrar todos los repuestos
      this.repuestosFiltrados = this.repuestos;
      return;
    }
    
    if (this.tipoActual !== 'todos' && this.marcaSeleccionada === 'todas') {
      // Solo filtrar por subcategoría
      this.productoService.getProductosPorSubcategoria(this.tipoActual).subscribe(productos => {
        this.repuestosFiltrados = productos;
      });
      return;
    }
    
    // Comenzar con todos los repuestos o filtrados por subcategoría
    if (this.tipoActual !== 'todos') {
      this.productoService.getProductosPorSubcategoria(this.tipoActual).subscribe(productos => {
        // Aplicar filtro adicional por marca si es necesario
        if (this.marcaSeleccionada !== 'todas') {
          this.repuestosFiltrados = productos.filter(p => p.marca === this.marcaSeleccionada);
        } else {
          this.repuestosFiltrados = productos;
        }
      });
    } else {
      // Solo filtrar por marca
      if (this.marcaSeleccionada !== 'todas') {
        this.repuestosFiltrados = this.repuestos.filter(p => p.marca === this.marcaSeleccionada);
      } else {
        this.repuestosFiltrados = this.repuestos;
      }
    }
  }

  verDetalles(id: number): void {
    this.router.navigate(['/producto', id]);
  }
}