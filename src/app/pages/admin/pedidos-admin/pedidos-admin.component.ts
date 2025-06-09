import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedidos-admin',
  templateUrl: './pedidos-admin.component.html',
  styleUrls: ['./pedidos-admin.component.css']
})
export class PedidosAdminComponent implements OnInit {
  pedidos: any[] = [];
  cargando: boolean = true;
  error: string = '';
  filtroEstado: string = 'todos';
  filtroDesde: string = '';
  filtroHasta: string = '';
  
  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.pedidoService.getTodosPedidos().subscribe({
      next: (data) => {
        // Ordenar los pedidos por fecha (más recientes primero)
        this.pedidos = data.sort((a, b) => {
          return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        // Si hay un error, intentar cargar de localStorage
        this.cargarPedidosLocales();
        this.error = 'Hubo un problema al cargar los pedidos.';
        this.cargando = false;
      }
    });
  }

  // Método alternativo para cargar de localStorage si la API falla
  cargarPedidosLocales(): void {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      this.pedidos = pedidosGuardados;
      
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
    this.router.navigate(['/admin/pedido', pedidoId]);
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
  
  // Aplicar filtros
  aplicarFiltros(): void {
    this.cargarPedidos(); // Recargar todos los pedidos
    
    // Filtrar por estado si es necesario
    if (this.filtroEstado !== 'todos') {
      this.pedidos = this.pedidos.filter(pedido => 
        pedido.estado.toLowerCase() === this.filtroEstado.toLowerCase()
      );
    }
    
    // Filtrar por fecha si se especificó
    if (this.filtroDesde) {
      const fechaDesde = new Date(this.filtroDesde);
      this.pedidos = this.pedidos.filter(pedido => 
        new Date(pedido.fechaCreacion) >= fechaDesde
      );
    }
    
    if (this.filtroHasta) {
      const fechaHasta = new Date(this.filtroHasta);
      fechaHasta.setHours(23, 59, 59); // Establecer al final del día
      this.pedidos = this.pedidos.filter(pedido => 
        new Date(pedido.fechaCreacion) <= fechaHasta
      );
    }
  }
  
  limpiarFiltros(): void {
    this.filtroEstado = 'todos';
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.cargarPedidos();
  }
  
  cambiarEstado(pedido: any, nuevoEstado: string): void {
    // Esto debería ser una llamada a la API en un entorno real
    pedido.estado = nuevoEstado;
    
    // Actualizar en localStorage para simular persistencia
    const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const index = pedidosGuardados.findIndex((p: any) => p._id === pedido._id);
    
    if (index !== -1) {
      pedidosGuardados[index].estado = nuevoEstado;
      localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));
    }
    
    // En un entorno real, se haría una llamada a la API
    /*
    this.pedidoService.actualizarEstadoPedido(pedido._id, nuevoEstado).subscribe({
      next: () => {
        console.log('Estado actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        // Revertir cambio en caso de error
        pedido.estado = estadoAnterior;
      }
    });
    */
  }
}