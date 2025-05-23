import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  productoForm: FormGroup;
  productoId: string | null = null;
  modo: 'crear' | 'editar' = 'crear';
  cargando: boolean = false;
  guardando: boolean = false;
  errorMensaje: string = '';
  imagenPreview: string | ArrayBuffer | null = null;
  // Mantenemos estos arrays solo para visualización en edición
  imagenesPreview: (string | ArrayBuffer)[] = [];
  categorias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      descripcionLarga: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoria: ['', [Validators.required]],
      subcategoria: [''],
      sku: [''],
      marca: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      destacado: [false],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    // Carga las categorías al iniciar
    this.cargarCategorias();
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productoId = id;
        this.modo = 'editar';
        this.cargarProducto(id);
      }
    });
  }
  
  // Método para cargar las categorías
  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', categorias);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  cargarProducto(id: string) {
    this.cargando = true;
    this.adminService.getProducto(id).subscribe({
      next: (producto) => {
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          descripcionLarga: producto.descripcionLarga || '',
          precio: producto.precio,
          categoria: producto.categoria,
          subcategoria: producto.subcategoria || '',
          sku: producto.sku || '',
          marca: producto.marca || '',
          stock: producto.stock,
          destacado: producto.destacado
        });
        
        if (producto.imagenUrl) {
          this.imagenPreview = producto.imagenUrl;
        }
        
        if (producto.imagenesAdicionales && producto.imagenesAdicionales.length > 0) {
          // Solo almacenamos las URL para mostrarlas
          this.imagenesPreview = producto.imagenesAdicionales;
        }
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el producto:', error);
        this.errorMensaje = 'No se pudo cargar el producto. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.productoForm.patchValue({ imagen: file });
      
      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.productoForm.invalid) {
      return;
    }

    this.guardando = true;
    this.errorMensaje = '';

    const formData = new FormData();
    const formValue = this.productoForm.value;
    
    // Añadir todos los campos del formulario a formData
    Object.keys(formValue).forEach(key => {
      if (key !== 'imagen') {
        formData.append(key, formValue[key]);
      }
    });
    
    // Añadir solo la imagen principal si existe
    if (formValue.imagen) {
      formData.append('imagen', formValue.imagen);
    }

    if (this.modo === 'crear') {
      this.crearProducto(formData);
    } else {
      this.actualizarProducto(formData);
    }
  }

  crearProducto(formData: FormData) {
    this.adminService.crearProducto(formData).subscribe({
      next: (respuesta) => {
        this.guardando = false;
        alert('Producto creado exitosamente.');
        this.router.navigate(['/admin/productos']);
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al crear el producto:', error);
        this.errorMensaje = error.error?.mensaje || 'No se pudo crear el producto. Inténtelo de nuevo.';
      }
    });
  }

  actualizarProducto(formData: FormData) {
    if (!this.productoId) return;
    
    this.adminService.actualizarProducto(this.productoId, formData).subscribe({
      next: (respuesta) => {
        this.guardando = false;
        alert('Producto actualizado exitosamente.');
        this.router.navigate(['/admin/productos']);
      },
      error: (error) => {
        this.guardando = false;
        console.error('Error al actualizar el producto:', error);
        this.errorMensaje = error.error?.mensaje || 'No se pudo actualizar el producto. Inténtelo de nuevo.';
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/productos']);
  }
}