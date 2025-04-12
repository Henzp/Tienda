import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit {
  productos: any[] = [];
  cargando: boolean = true;
  error: string = '';
  
  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.adminService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'No se pudieron cargar los productos. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  verProducto(id: string) {
    this.router.navigate(['/admin/productos/editar', id]);
  }

  nuevoProducto() {
    this.router.navigate(['/admin/productos/nuevo']);
  }

  eliminarProducto(id: string, event: Event) {
    event.stopPropagation();
    
    if (confirm('¿Está seguro que desea eliminar este producto?')) {
      this.adminService.eliminarProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(producto => producto._id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          alert('No se pudo eliminar el producto. Inténtelo de nuevo.');
        }
      });
    }
  }
}