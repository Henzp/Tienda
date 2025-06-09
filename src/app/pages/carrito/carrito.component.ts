// Este es el contenido para el archivo: E:\Proyecto\tienda\src\app\pages\carrito\carrito.component.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito-item';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
    private router: Router,
    private authService: AuthService
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
    // Verificar si el usuario está autenticado
    if (!this.authService.estaLogueado()) {
      if (confirm('Necesitas iniciar sesión para completar la compra. ¿Deseas ir a la página de inicio de sesión?')) {
        // Redirección simple con query params
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      }
      return;
    }
    
    // Si hay productos en el carrito y el usuario está autenticado, redireccionar al checkout
    if (this.items.length > 0) {
      this.router.navigate(['/checkout']);
    } else {
      alert('No hay productos en el carrito');
    }
  }
}