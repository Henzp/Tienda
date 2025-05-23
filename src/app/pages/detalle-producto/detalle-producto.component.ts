import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto | null = null;
  productosRelacionados: Producto[] = [];
  imagenActual: string = '';
  imagenIndex: number = 0;
  imagenZoom: boolean = false;
  loading: boolean = true;
  error: boolean = false;
  cantidad: number = 1;
  cantidadSeleccionada: number = 1;
  categoriaUrl: string = '';
  zoomPosition: string = 'center';
  
  // Aquí podrías añadir imágenes adicionales por producto
  imagenesAdicionales: { [key: number]: string[] } = {
    // Aceites
    5: [
      'assets/Aceites/Castrol10w50.jpg',
      'assets/Aceites/Castrol10w50_detail1.jpg',
      'assets/Aceites/Castrol10w50_detail2.jpg'
    ],
    // Neumáticos
    6: [
      'assets/Neumaticos/continental/contisportattack_120-70zr-17.jpg',
      'assets/Neumaticos/continental/contisportattack_detail1.jpg',
      'assets/Neumaticos/continental/contisportattack_detail2.jpg'
    ]
    // Añade más productos aquí
  };
  
  imagenes: string[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        // Pasar el id como string, el servicio se encargará de manejarlo
        this.cargarProducto(idParam);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  obtenerUrlCategoria(categoria: string): string {
    // Convertir el nombre de la categoría a una URL válida
    if (!categoria) return '';
    
    const categoriaLower = categoria.toLowerCase();
    
    // Mapear categorías especiales si es necesario
    switch (categoriaLower) {
      case 'neumáticos':
        return 'neumaticos';
      case 'accesorios':
        return 'accesorios';
      case 'cascos':
        return 'cascos';
      case 'lubricantes':
        return 'lubricantes';
      case 'guantes':
        return 'guantes';
      case 'repuestos':
        return 'repuestos';
      default:
        return categoriaLower;
    }
  }
  
  cargarProducto(id: string | number): void {
    // Usar el método getProductoById del servicio actualizado
    this.productoService.getProductoById(id).subscribe(
      producto => {
        this.producto = producto || null;
        
        if (producto) {
          // Generar la URL de la categoría para el breadcrumb
          this.categoriaUrl = this.obtenerUrlCategoria(producto.categoria);
          
          // Usar imágenes adicionales del producto si existen
          if (producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0) {
            this.imagenes = producto.imagenesAdicionales;
          } else {
            // Si no hay imágenes adicionales, usar solo la principal
            this.imagenes = [producto.imagenUrl];
          }
          
          // Establecer la imagen principal
          this.imagenActual = this.imagenes[0];
          this.imagenIndex = 0;
          
          // Resetear la cantidad seleccionada
          this.cantidadSeleccionada = 1;
          
          // Cargar productos relacionados
          this.cargarProductosRelacionados(producto.categoria);
        } else {
          this.error = true;
        }
        
        this.loading = false;
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
  }
  
  cargarProductosRelacionados(categoria: string): void {
    this.productoService.getProductosPorCategoria(categoria).subscribe(productos => {
      // Filtrar para excluir el producto actual y mostrar solo 4
      this.productosRelacionados = productos
        .filter(p => {
          // Comparación segura para evitar errores con ids indefinidos
          if (!this.producto) return true;
          
          // Obtener ID del producto actual (usando _id o id, lo que esté disponible)
          const productoActualId = this.producto._id || this.producto.id;
          if (!productoActualId || !p.id) return true;
          
          // Comparar como string para manejar tanto números como strings
          return p.id.toString() !== productoActualId.toString();
        })
        .slice(0, 4);
    });
  }
  
  cambiarImagen(imagen: string): void {
    this.imagenActual = imagen;
    this.imagenIndex = this.imagenes.indexOf(imagen);
    this.imagenZoom = false;
  }
  
  imagenAnterior(): void {
    this.imagenIndex = (this.imagenIndex - 1 + this.imagenes.length) % this.imagenes.length;
    this.imagenActual = this.imagenes[this.imagenIndex];
    this.imagenZoom = false;
  }
  
  imagenSiguiente(): void {
    this.imagenIndex = (this.imagenIndex + 1) % this.imagenes.length;
    this.imagenActual = this.imagenes[this.imagenIndex];
    this.imagenZoom = false;
  }
  
  toggleZoom(): void {
    this.imagenZoom = !this.imagenZoom;
    if (!this.imagenZoom) {
      this.zoomPosition = 'center'; // Restablece la posición de zoom
    }
  }
  
  onMouseMove(event: MouseEvent): void {
    if (this.imagenZoom) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      this.zoomPosition = `${x}% ${y}%`;
    }
  }
  
  disminuirCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
  
  aumentarCantidad(): void {
    if (this.cantidad < 10) {
      this.cantidad++;
    }
  }
  
  formatearDescripcion(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/• /g, '<br>• ')
      .replace(/\n/g, '<br>'); // Reemplaza saltos de línea por <br>
  }

  agregarAlCarrito(): void {
    if (this.producto) {
      const resultado = this.carritoService.agregarItem(this.producto, this.cantidadSeleccionada);
      
      if (resultado.exito) {
        alert(resultado.mensaje);
      } else {
        alert(resultado.mensaje);
      }
    }
  }
  
  incrementarCantidad(): void {
    if (this.producto && this.producto.stock !== undefined && this.cantidadSeleccionada < this.producto.stock) {
      this.cantidadSeleccionada++;
    }
  }

  decrementarCantidad(): void {
    if (this.cantidadSeleccionada > 1) {
      this.cantidadSeleccionada--;
    }
  }
  get productoStock(): number {
    return this.producto?.stock ?? 0;
  }
  
  get hayStock(): boolean {
    return this.productoStock > 0;
  }
}