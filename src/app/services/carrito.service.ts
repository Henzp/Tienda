import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Interfaz para los items del carrito
export interface CarritoItem {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl: string;
  stockDisponible: number; // Campo para el stock disponible
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Usamos BehaviorSubject para que los componentes puedan suscribirse a cambios
  private itemsCarrito = new BehaviorSubject<CarritoItem[]>([]);
  
  constructor() { 
    // Cargar carrito desde localStorage al iniciar
    this.cargarCarrito();
  }

  // Método para obtener los items como Observable
  getItems(): Observable<CarritoItem[]> {
    return this.itemsCarrito.asObservable();
  }

  // Añadir un producto al carrito con verificación de stock
  agregarItem(producto: any, cantidadSolicitada: number = 1): { exito: boolean, mensaje: string } {
    // Verificar si hay stock disponible
    if (!producto.stock || producto.stock <= 0) {
      return { 
        exito: false, 
        mensaje: 'Producto agotado.'
      };
    }
    
    // Verificar si hay suficiente stock
    if (producto.stock < cantidadSolicitada) {
      return { 
        exito: false, 
        mensaje: `No hay suficiente stock. Solo quedan ${producto.stock} unidades disponibles.` 
      };
    }

    const carritoActual = this.itemsCarrito.value;
    const itemExistente = carritoActual.find(item => item.productoId === producto._id);
    
    if (itemExistente) {
      // Verificar si la nueva cantidad total excede el stock disponible
      const nuevaCantidad = itemExistente.cantidad + cantidadSolicitada;
      
      if (nuevaCantidad > producto.stock) {
        return { 
          exito: false, 
          mensaje: `No puede agregar ${cantidadSolicitada} más. Solo quedan ${producto.stock - itemExistente.cantidad} unidades disponibles.` 
        };
      }
      
      // Si hay stock suficiente, incrementar cantidad
      itemExistente.cantidad = nuevaCantidad;
    } else {
      // Añadir nuevo item
      carritoActual.push({
        productoId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidadSolicitada,
        imagenUrl: producto.imagenUrl,
        stockDisponible: producto.stock // Guardamos el stock disponible
      });
    }
    
    // Actualizar carrito y guardar en localStorage
    this.itemsCarrito.next(carritoActual);
    this.guardarCarrito();
    
    return { 
      exito: true, 
      mensaje: `${cantidadSolicitada} ${producto.nombre}${cantidadSolicitada > 1 ? 's' : ''} añadido al carrito` 
    };
  }

  // Eliminar un producto del carrito
  eliminarItem(productoId: string): void {
    const carritoActual = this.itemsCarrito.value;
    const nuevoCarrito = carritoActual.filter(item => item.productoId !== productoId);
    
    this.itemsCarrito.next(nuevoCarrito);
    this.guardarCarrito();
  }

  // Actualizar cantidad de un producto con validación de stock
  actualizarCantidad(productoId: string, cantidad: number): { exito: boolean, mensaje: string } {
    if (cantidad <= 0) {
      this.eliminarItem(productoId);
      return { exito: true, mensaje: 'Producto eliminado del carrito' };
    }
    
    const carritoActual = this.itemsCarrito.value;
    const item = carritoActual.find(item => item.productoId === productoId);
    
    if (item) {
      // Verificar si la nueva cantidad excede el stock disponible
      if (cantidad > item.stockDisponible) {
        return { 
          exito: false, 
          mensaje: `No hay suficiente stock. Solo hay ${item.stockDisponible} unidades disponibles.` 
        };
      }
      
      item.cantidad = cantidad;
      this.itemsCarrito.next(carritoActual);
      this.guardarCarrito();
      return { exito: true, mensaje: 'Cantidad actualizada' };
    }
    
    return { exito: false, mensaje: 'Producto no encontrado en el carrito' };
  }

  // Vaciar el carrito
  vaciarCarrito(): void {
    this.itemsCarrito.next([]);
    localStorage.removeItem('carrito');
  }

  // Obtener total de productos en el carrito
  getTotalItems(): Observable<number> {
    return new Observable<number>(observer => {
      this.getItems().subscribe(items => {
        const total = items.reduce((sum, item) => sum + item.cantidad, 0);
        observer.next(total);
      });
    });
  }

  // Obtener subtotal del carrito
  getSubtotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.getItems().subscribe(items => {
        const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        observer.next(subtotal);
      });
    });
  }

  // Guardar carrito en localStorage
  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.itemsCarrito.value));
  }

  // Cargar carrito desde localStorage
  private cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    
    if (carritoGuardado) {
      try {
        const items = JSON.parse(carritoGuardado);
        this.itemsCarrito.next(items);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    }
  }
}