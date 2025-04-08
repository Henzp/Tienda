import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  producto: Producto | undefined;
  imagenActual: string = '';
  imagenZoom: boolean = false;
  loading: boolean = true;
  error: boolean = false;

  // Aquí podrías añadir imágenes adicionales por producto
  // En un caso real, estas vendrían del backend
  imagenesAdicionales: { [key: number]: string[] } = {
    // Para el producto con ID 6 (Neumatico Continental Contisport attack)
    6: [
      'assets/Neumaticos/continental/contisportattack_120-70zr-17.jpg',
      'assets/Neumaticos/continental/contisportattack_detail1.jpg',
      'assets/Neumaticos/continental/contisportattack_detail2.jpg'
    ],
    // Para otros productos...
    7: [
      'assets/Neumaticos/continental/contimotion_180-55-zr17w73.jpg',
      'assets/Neumaticos/continental/contimotion_detail1.jpg',
      'assets/Neumaticos/continental/contimotion_detail2.jpg'
    ]
  };

  // Imágenes por defecto si no hay imágenes adicionales configuradas
  imagenes: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    // Obtener el ID del producto de la URL
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      
      if (id) {
        this.cargarProducto(id);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  cargarProducto(id: number): void {
    this.productoService.getProductoById(id).subscribe(
      producto => {
        this.producto = producto;
        
        if (producto) {
          // Establecer la imagen principal
          this.imagenActual = producto.imagenUrl;
          
          // Cargar imágenes adicionales si existen
          if (this.imagenesAdicionales[id]) {
            this.imagenes = this.imagenesAdicionales[id];
          } else {
            // Si no hay imágenes adicionales, usar solo la principal
            this.imagenes = [producto.imagenUrl];
          }
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

  cambiarImagen(imagen: string): void {
    this.imagenActual = imagen;
    this.imagenZoom = false;
  }

  toggleZoom(): void {
    this.imagenZoom = !this.imagenZoom;
  }
}