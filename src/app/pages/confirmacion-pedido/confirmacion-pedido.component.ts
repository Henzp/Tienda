// Este es el contenido actualizado para: src/app/pages/confirmacion-pedido/confirmacion-pedido.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-confirmacion-pedido',
  templateUrl: './confirmacion-pedido.component.html',
  styleUrls: ['./confirmacion-pedido.component.css']
})
export class ConfirmacionPedidoComponent implements OnInit {
  pedidoId: string | null = null;
  pedido: any = null;
  cargando: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.pedidoId = params.get('id');
      if (this.pedidoId) {
        this.cargarPedido(this.pedidoId);
      } else {
        this.cargando = false;
        this.error = true;
      }
    });
  }

  cargarPedido(id: string): void {
    // Primero intentar cargar desde la API
    this.pedidoService.getPedido(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.cargando = false;
      },
      error: (error) => {
        console.warn('Error al cargar pedido desde API, intentando localmente:', error);
        // Si falla, intentar cargar desde localStorage
        this.cargarPedidoLocal(id);
      }
    });
  }

  cargarPedidoLocal(id: string): void {
    try {
      const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
      this.pedido = pedidosGuardados.find((p: any) => p._id === id);
      
      if (!this.pedido) {
        this.error = true;
        console.error('Pedido no encontrado en localStorage:', id);
      }
      
      this.cargando = false;
    } catch (error) {
      console.error('Error al cargar pedido desde localStorage:', error);
      this.error = true;
      this.cargando = false;
    }
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}