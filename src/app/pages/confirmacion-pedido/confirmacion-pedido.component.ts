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
    this.pedidoService.getPedido(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el pedido:', error);
        this.cargando = false;
        this.error = true;
      }
    });
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  irAInicio(): void {
    this.router.navigate(['/']);
  }
}