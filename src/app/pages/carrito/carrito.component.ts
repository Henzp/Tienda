import { Component, OnInit } from '@angular/core';
import { CarritoService, CarritoItem } from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  items: CarritoItem[] = [];
  subtotal: number = 0;
  
  constructor(
    private carritoService: CarritoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carritoService.getItems().subscribe(items => {
      this.items = items;
    });
    
    this.carritoService.getSubtotal().subscribe(subtotal => {
      this.subtotal = subtotal;
    });
  }

  actualizarCantidad(productoId: string, cantidad: number): void {
    const resultado = this.carritoService.actualizarCantidad(productoId, cantidad);
    
    if (!resultado.exito) {
      alert(resultado.mensaje);
      // Recargar los items para asegurar que se muestre la cantidad correcta
      this.carritoService.getItems().subscribe(items => {
        this.items = items;
      });
    }
  }

  eliminarItem(productoId: string): void {
    if (confirm('¿Está seguro que desea eliminar este producto del carrito?')) {
      this.carritoService.eliminarItem(productoId);
    }
  }

  vaciarCarrito(): void {
    if (confirm('¿Está seguro que desea vaciar el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

  continuarComprando(): void {
    this.router.navigate(['/productos']);
  }

  procesarCompra(): void {
    // Por ahora solo mostraremos un mensaje
    alert('¡Gracias por su compra! Funcionalidad en desarrollo.');
    this.carritoService.vaciarCarrito();
    this.router.navigate(['/']);
  }
}