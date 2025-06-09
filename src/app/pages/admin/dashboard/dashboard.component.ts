import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Estadísticas iniciales (valores por defecto)
  stats = {
    totalProductos: 0,
    totalCategorias: 0,
    productosDestacados: 0,
    totalUsuarios: 0
  };
  
  // Productos recientes
  recentProducts: any[] = [];
  
  // Estado de carga
  loading = true;
  
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarProductosRecientes();
  }
  
  cargarEstadisticas() {
    // Obtener número total de productos
    this.adminService.getProductos().subscribe({
      next: (productos) => {
        this.stats.totalProductos = productos.length;
        
        // Contar productos destacados
        this.stats.productosDestacados = productos.filter(p => p.destacado).length;
        
        // Obtener categorías únicas
        const categoriasUnicas = new Set(productos.map(p => p.categoria));
        this.stats.totalCategorias = categoriasUnicas.size;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas de productos:', error);
        this.loading = false;
      }
    });
    
    // Simular conteo de usuarios - en una implementación real obtendrías esto de la API
    // Por ahora lo configuramos a 1 (solo el admin)
    this.stats.totalUsuarios = 1;
  }
  
  cargarProductosRecientes() {
    this.adminService.getProductos().subscribe({
      next: (productos) => {
        // Ordenar por fecha de creación descendente (los más recientes primero)
        // Asumiendo que hay un campo 'fechaCreacion' o similar
        this.recentProducts = productos
          .sort((a, b) => new Date(b.fechaCreacion || b._id).getTime() - new Date(a.fechaCreacion || a._id).getTime())
          .slice(0, 5); // Tomar solo los 5 más recientes
      },
      error: (error) => {
        console.error('Error al cargar productos recientes:', error);
      }
    });
  }
  
  handleImageError(event: any) {
    // Cargar imagen de respaldo si la imagen original falla
    event.target.src = 'assets/placeholder-producto.jpg';
  }
  
  verProducto(id: string) {
    // Navegar a la página de detalles del producto en la tienda
    this.router.navigate(['/producto', id]);
  }
  
  editarProducto(id: string) {
    // Navegar a la página de edición del producto
    this.router.navigate(['/admin/productos/editar', id]);
  }
}