import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetalleComponent implements OnInit {
  pedidoId: string | null = null;
  pedido: any = null;
  cargando: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.estaLogueado()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    this.route.paramMap.subscribe(params => {
      this.pedidoId = params.get('id');
      if (this.pedidoId) {
        this.cargarPedido(this.pedidoId);
      } else {
        this.cargando = false;
        this.error = 'ID de pedido no válido';
      }
    });
  }

  cargarPedido(id: string): void {
    this.pedidoService.getPedido(id).subscribe({
      next: (data) => {
        this.pedido = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar el pedido:', err);
        // Intentar cargar desde localStorage
        this.cargarPedidoLocal(id);
      }
    });
  }

  cargarPedidoLocal(id: string): void {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      this.pedido = pedidosGuardados.find((p: any) => p._id === id);
      
      if (!this.pedido) {
        this.error = 'Pedido no encontrado';
      }
      
      this.cargando = false;
    } catch (error) {
      console.error('Error al cargar pedido desde localStorage:', error);
      this.error = 'Error al cargar el pedido';
      this.cargando = false;
    }
  }

  volver(): void {
    this.router.navigate(['/pedidos']);
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
  
  getMetodoPagoTexto(metodoPago: string): string {
    switch (metodoPago) {
      case 'tarjeta':
        return 'Tarjeta de Crédito/Débito';
      case 'transferencia':
        return 'Transferencia Bancaria';
      case 'contrarembolso':
        return 'Pago contra entrega';
      default:
        return metodoPago;
    }
  }
  
  getMetodoEnvioTexto(tipoEnvio: string): string {
    switch (tipoEnvio) {
      case 'estandar':
        return 'Envío Estándar (2-5 días hábiles)';
      case 'express':
        return 'Envío Express (1-2 días hábiles)';
      default:
        return tipoEnvio;
    }
  }
}