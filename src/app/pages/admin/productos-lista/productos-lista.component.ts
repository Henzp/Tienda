// productos-lista.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-productos-lista',
  templateUrl: './productos-lista.component.html',
  styleUrls: ['./productos-lista.component.css']
})
export class ProductosListaComponent implements OnInit {
  productos: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
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
        this.filteredProducts = [...productos];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'No se pudieron cargar los productos. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  filterProducts() {
    if (!this.searchTerm) {
      this.filteredProducts = [...this.productos];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.productos.filter(producto => 
      producto.nombre.toLowerCase().includes(term) || 
      producto.categoria.toLowerCase().includes(term) ||
      (producto.marca && producto.marca.toLowerCase().includes(term))
    );
  }

  nuevoProducto() {
    this.router.navigate(['/admin/productos/nuevo']);
  }

  editarProducto(id: string) {
    this.router.navigate(['/admin/productos/editar', id]);
  }

  eliminarProducto(id: string, event: Event) {
    event.stopPropagation();
    
    if (confirm('¿Está seguro que desea eliminar este producto?')) {
      this.adminService.eliminarProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(producto => producto._id !== id);
          this.filterProducts();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.error = 'No se pudo eliminar el producto. Inténtelo de nuevo.';
        }
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = 'assets/placeholder-producto.jpg';
  }
}