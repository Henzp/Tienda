// Este es el contenido para: src/app/pages/checkout/checkout.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { CarritoItem } from '../../models/carrito-item';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { ProductoService } from '../../services/producto.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  items: CarritoItem[] = [];
  subtotal: number = 0;
  costoEnvio: number = 2990; // Valor predeterminado (envío estándar)
  total: number = 0;
  
  paso: number = 1;
  submitted: boolean = false;
  procesando: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private authService: AuthService,
    private productoService: ProductoService,
    private router: Router
  ) { }

  // Getter para simplificar el acceso a los controles de datosEnvio
  get datosEnvioForm() {
    return this.checkoutForm.get('datosEnvio') as FormGroup;
  }
  
  // Getter para simplificar el acceso a los controles de metodoEnvio
  get metodoEnvioForm() {
    return this.checkoutForm.get('metodoEnvio') as FormGroup;
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado
    if (!this.authService.estaLogueado()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    
    // Verificar si hay productos en el carrito
    this.carritoService.getItems().subscribe(items => {
      this.items = items;
      if (items.length === 0) {
        this.router.navigate(['/carrito']);
      }
    });
    
    // Obtener subtotal del carrito
    this.carritoService.getSubtotal().subscribe(subtotal => {
      this.subtotal = subtotal;
      this.calcularTotal();
    });
    
    // Inicializar formulario
    this.inicializarFormulario();
    
    // Escuchar cambios en el método de envío
    this.metodoEnvioForm.get('tipo')?.valueChanges.subscribe(valor => {
      this.costoEnvio = valor === 'express' ? 5990 : 2990;
      this.calcularTotal();
    });
  }
  
  inicializarFormulario(): void {
    // Obtener datos del usuario autenticado
    const usuarioActual = this.authService.getCurrentUser();
    
    // Valores predeterminados para el formulario
    const defaultNombre = usuarioActual?.nombre || '';
    const defaultApellido = usuarioActual?.apellido || '';
    const defaultEmail = usuarioActual?.email || '';
    
    this.checkoutForm = this.formBuilder.group({
      datosEnvio: this.formBuilder.group({
        nombre: [defaultNombre, Validators.required],
        apellido: [defaultApellido, Validators.required],
        email: [defaultEmail, [Validators.required, Validators.email]],
        telefono: ['', Validators.required],
        direccion: ['', Validators.required],
        ciudad: ['', Validators.required],
        codigoPostal: ['', Validators.required],
        provincia: [''],
        pais: ['Chile'],
        instrucciones: ['']
      }),
      metodoEnvio: this.formBuilder.group({
        tipo: ['estandar', Validators.required],
        costo: [2990]
      }),
      metodoPago: ['tarjeta', Validators.required],
      aceptarTerminos: [false, Validators.requiredTrue]
    });
  }
  
  anterior(): void {
    if (this.paso > 1) {
      this.paso--;
    }
  }
  
  siguiente(): void {
    this.submitted = true;
    
    // Validar según el paso actual
    if (this.paso === 1) {
      if (this.datosEnvioForm.invalid) {
        // Mostrar información detallada para debugging
        Object.keys(this.datosEnvioForm.controls).forEach(controlName => {
          const control = this.datosEnvioForm.get(controlName);
          console.log(`Control ${controlName}: valor=${control?.value}, válido=${control?.valid}, errores=`, control?.errors);
        });
        return;
      }
    } else if (this.paso === 2) {
      if (this.metodoEnvioForm.invalid) {
        return;
      }
    } else if (this.paso === 3) {
      if (this.checkoutForm.get('metodoPago')?.invalid) {
        return;
      }
    }
    
    // Avanzar al siguiente paso
    if (this.paso < 4) {
      this.paso++;
      this.submitted = false;
    }
  }
  
  calcularTotal(): void {
    this.total = this.subtotal + this.costoEnvio;
  }
  
  getMetodoPagoTexto(): string {
    const metodoPago = this.checkoutForm.get('metodoPago')?.value;
    
    switch (metodoPago) {
      case 'tarjeta':
        return 'Tarjeta de Crédito/Débito';
      case 'transferencia':
        return 'Transferencia Bancaria';
      case 'contrarembolso':
        return 'Pago contra entrega';
      default:
        return 'No seleccionado';
    }
  }
  
  // Método modificado para procesar la compra y actualizar el stock
  procesarCompra(): void {
    this.submitted = true;
    
    if (this.checkoutForm.invalid) {
      return;
    }
    
    this.procesando = true;
    
    // Preparar datos del pedido
    const datosEnvio = this.datosEnvioForm.value;
    const metodoEnvio = this.metodoEnvioForm.value;
    const metodoPago = this.checkoutForm.get('metodoPago')?.value;
    
    // Convertir items del carrito al formato necesario para el pedido
    const productosPedido = this.items.map(item => ({
      producto: item.productoId,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      imagenUrl: item.imagenUrl
    }));
    
    // 1. Actualizar el stock de cada producto
    const actualizacionesStock = this.items.map(item => {
      return this.productoService.actualizarStock(item.productoId, item.cantidad)
        .pipe(
          catchError(error => {
            console.error(`Error al actualizar stock para ${item.nombre}:`, error);
            return of(null); // Devolver null en caso de error
          })
        );
    });
    
    // Ejecutar todas las actualizaciones de stock en paralelo
    forkJoin(actualizacionesStock).subscribe({
      next: (resultados) => {
        // Verificar si todos los stocks se actualizaron correctamente
        const todoExitoso = resultados.every(resultado => resultado !== null);
        
        if (!todoExitoso) {
          this.procesando = false;
          alert('Hubo un problema al actualizar el stock de algunos productos. Por favor, intenta nuevamente.');
          return;
        }
        
        // 2. Si todo el stock se actualizó correctamente, crear el pedido
        // Crear un ID de pedido simulado
        const pedidoSimulado = {
          _id: 'pedido-' + Date.now(),
          numeroPedido: '0424-' + Math.floor(10000 + Math.random() * 90000),
          productos: productosPedido,
          datosEnvio: datosEnvio,
          metodoEnvio: {
            tipo: metodoEnvio.tipo,
            costo: this.costoEnvio
          },
          metodoPago: metodoPago,
          subtotal: this.subtotal,
          total: this.total,
          estado: 'pendiente',
          fechaCreacion: new Date().toISOString()
        };
        
        // Si ya tienes el backend para crear pedidos, usa este código en lugar de localStorage
        // this.pedidoService.crearPedido(pedidoData).subscribe({
        //   next: (pedidoCreado) => {
        //     this.carritoService.vaciarCarrito();
        //     this.procesando = false;
        //     this.router.navigate(['/confirmacion-pedido', pedidoCreado._id]);
        //   },
        //   error: (error) => {
        //     console.error('Error al crear pedido:', error);
        //     this.procesando = false;
        //     alert('Error al crear el pedido');
        //   }
        // });
        
        // Si estás usando simulación con localStorage
        const pedidosGuardados = JSON.parse(localStorage.getItem('pedidos') || '[]');
        pedidosGuardados.push(pedidoSimulado);
        localStorage.setItem('pedidos', JSON.stringify(pedidosGuardados));
        
        // Vaciar carrito
        this.carritoService.vaciarCarrito();
        
        // Redireccionar a la página de confirmación
        this.procesando = false;
        this.router.navigate(['/confirmacion-pedido', pedidoSimulado._id]);
        
        console.log('Pedido simulado creado:', pedidoSimulado);
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        this.procesando = false;
        alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
      }
    });
  }
  
  continuarComprando(): void {
    this.router.navigate(['/carrito']);
  }
}