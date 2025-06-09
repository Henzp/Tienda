import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  cargando: boolean = true;
  error: string = '';
  
  constructor(
    private pedidoService: PedidoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    const usuario = this.authService.getCurrentUser();
    if (!usuario) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/pedidos' } });
      return;
    }
    
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getPedidosPorUsuario().subscribe({
      next: (data) => {
        // Ordenar los pedidos por fecha (más recientes primero)
        this.pedidos = data.sort((a, b) => {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        // Si hay un error de localStorage, intentar cargar de localStorage
        this.cargarPedidosLocales();
        this.error = 'Hubo un problema al cargar tus pedidos.';
        this.cargando = false;
      }
    });
  }

  // Método alternativo para cargar de localStorage si la API falla
  cargarPedidosLocales(): void {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      // Filtrar para mostrar solo los pedidos del usuario actual
      const usuarioActual = this.authService.getCurrentUser();
      
      if (usuarioActual && usuarioActual.email) {
        this.pedidos = pedidosGuardados.filter((pedido: any) => 
          pedido.datosEnvio && pedido.datosEnvio.email === usuarioActual.email
        );
      } else {
        this.pedidos = pedidosGuardados;
      }
      
      // Ordenar por fecha (más recientes primero)
      this.pedidos.sort((a: any, b: any) => {
        return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
      });
    } catch (error) {
      console.error('Error al cargar pedidos desde localStorage:', error);
      this.pedidos = [];
    }
  }

  verDetallePedido(pedidoId: string): void {
    this.router.navigate(['/pedido', pedidoId]);
  }

  // Método para formatear la fecha
  formatearFecha(fecha: string): string {
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  }
  
  // Método para obtener el estado con el formato adecuado
  getEstadoClase(estado: string): string {
    switch(estado.toLowerCase()) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'procesando':
        return 'estado-procesando';
      case 'enviado':
        return 'estado-enviado';
      case 'entregado':
        return 'estado-entregado';
      case 'cancelado':
        return 'estado-cancelado';
      default:
        return '';
    }
  }
}