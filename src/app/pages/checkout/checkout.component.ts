import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  items: any[] = [];
  subtotal: number = 0;
  costoEnvio: number = 0;
  total: number = 0;
  
  pasoActual: number = 1;
  errorMensaje: string = '';
  enviandoPedido: boolean = false;
  pedidoCompletado: boolean = false;
  numeroPedido: string = '';
  
  datosEnvioForm: FormGroup;
  metodoEnvioForm: FormGroup;
  metodoPagoForm: FormGroup;
  
  metodoEnvioSeleccionado: string = 'estandar';
  metodoPagoSeleccionado: string = 'tarjeta';
  
  constructor(
    private carritoService: CarritoService,
    public pedidoService: PedidoService, // Cambiado a public para que esté accesible desde el template
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inicializar formularios
    this.datosEnvioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required]],
      provincia: [''],
      pais: ['Chile'],
      instrucciones: ['']
    });
    
    this.metodoEnvioForm = this.fb.group({
      tipo: ['estandar', [Validators.required]]
    });
    
    this.metodoPagoForm = this.fb.group({
      tipo: ['tarjeta', [Validators.required]],
      nombreTarjeta: ['', []],
      numeroTarjeta: ['', []],
      fechaVencimiento: ['', []],
      cvv: ['', []]
    });
  }

  ngOnInit(): void {
    // Verificar si el usuario está autenticado usando el método que acabamos de añadir
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    
    // Cargar datos del usuario si está disponible
    this.authService.usuario$.subscribe(usuario => {
      if (usuario) {
        this.datosEnvioForm.patchValue({
          nombre: usuario.nombre || '',
          apellido: usuario.apellido || '',
          email: usuario.email || ''
        });
      }
    });
    
    // Cargar items del carrito
    this.carritoService.getItems().subscribe(items => {
      this.items = items;
      
      // Si el carrito está vacío, redirigir al carrito
      if (items.length === 0) {
        this.router.navigate(['/carrito']);
      }
    });
    
    // Calcular subtotal
    this.carritoService.getSubtotal().subscribe(subtotal => {
      this.subtotal = subtotal;
      this.actualizarTotal();
    });
    
    // Escuchar cambios en el método de envío
    this.metodoEnvioForm.get('tipo')?.valueChanges.subscribe(valor => {
      this.metodoEnvioSeleccionado = valor;
      this.actualizarCostoEnvio();
    });
    
    // Escuchar cambios en el método de pago
    this.metodoPagoForm.get('tipo')?.valueChanges.subscribe(valor => {
      this.metodoPagoSeleccionado = valor;
      
      // Si el método de pago es tarjeta, agregar validadores
      if (valor === 'tarjeta') {
        this.metodoPagoForm.get('nombreTarjeta')?.setValidators([Validators.required]);
        this.metodoPagoForm.get('numeroTarjeta')?.setValidators([
          Validators.required, 
          Validators.pattern(/^\d{16}$/)
        ]);
        this.metodoPagoForm.get('fechaVencimiento')?.setValidators([
          Validators.required,
          Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)
        ]);
        this.metodoPagoForm.get('cvv')?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{3,4}$/)
        ]);
      } else {
        // Si no es tarjeta, quitar validadores
        this.metodoPagoForm.get('nombreTarjeta')?.clearValidators();
        this.metodoPagoForm.get('numeroTarjeta')?.clearValidators();
        this.metodoPagoForm.get('fechaVencimiento')?.clearValidators();
        this.metodoPagoForm.get('cvv')?.clearValidators();
      }
      
      // Actualizar estado de validación
      this.metodoPagoForm.get('nombreTarjeta')?.updateValueAndValidity();
      this.metodoPagoForm.get('numeroTarjeta')?.updateValueAndValidity();
      this.metodoPagoForm.get('fechaVencimiento')?.updateValueAndValidity();
      this.metodoPagoForm.get('cvv')?.updateValueAndValidity();
    });
    
    // Inicializar costo de envío
    this.actualizarCostoEnvio();
  }
  
  actualizarCostoEnvio(): void {
    this.costoEnvio = this.pedidoService.calcularCostoEnvio(
      this.metodoEnvioSeleccionado, 
      this.subtotal
    );
    this.actualizarTotal();
  }
  
  actualizarTotal(): void {
    this.total = this.subtotal + this.costoEnvio;
  }
  
  irAlPaso(paso: number): void {
    // Validar que se pueda avanzar al siguiente paso
    if (paso > this.pasoActual) {
      if (paso === 2 && this.datosEnvioForm.invalid) {
        this.datosEnvioForm.markAllAsTouched();
        return;
      }
      
      if (paso === 3 && this.metodoEnvioForm.invalid) {
        this.metodoEnvioForm.markAllAsTouched();
        return;
      }
      
      if (paso === 4 && this.metodoPagoForm.invalid) {
        this.metodoPagoForm.markAllAsTouched();
        return;
      }
    }
    
    this.pasoActual = paso;
    
    // Si es el paso de método de envío, actualizar costo
    if (paso === 2) {
      this.actualizarCostoEnvio();
    }
  }
  
  finalizarCompra(): void {
    if (this.datosEnvioForm.invalid || this.metodoEnvioForm.invalid || this.metodoPagoForm.invalid) {
      return;
    }
    
    this.enviandoPedido = true;
    this.errorMensaje = '';
    
    // Preparar datos del pedido
    const productosFormateados = this.items.map(item => ({
      producto: item.productoId,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
      imagenUrl: item.imagenUrl
    }));
    
    const pedidoData = {
      productos: productosFormateados,
      datosEnvio: this.datosEnvioForm.value,
      metodoPago: this.metodoPagoSeleccionado,
      metodoEnvio: {
        tipo: this.metodoEnvioSeleccionado,
        costo: this.costoEnvio
      }
    };
    
    // Enviar pedido
    this.pedidoService.crearPedido(pedidoData).subscribe({
      next: (respuesta) => {
        this.enviandoPedido = false;
        this.pedidoCompletado = true;
        this.numeroPedido = respuesta.pedido.numeroPedido;
        
        // Vaciar carrito
        this.carritoService.vaciarCarrito();
      },
      error: (error) => {
        this.enviandoPedido = false;
        console.error('Error al crear pedido:', error);
        this.errorMensaje = error.error?.mensaje || 'No se pudo procesar el pedido. Inténtelo de nuevo.';
      }
    });
  }
  
  volverAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }
  
  irAMisPedidos(): void {
    this.router.navigate(['/mi-cuenta/pedidos']);
  }
  
  continuarComprando(): void {
    this.router.navigate(['/productos']);
  }
  
  // Método auxiliar para calcular costo en la plantilla
  calcularCostoEnvioExpress(): number {
    return this.pedidoService.calcularCostoEnvio('express', this.subtotal);
  }
}