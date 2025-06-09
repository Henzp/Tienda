import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {
  categoriaForm: FormGroup;
  categoriaId: string | null = null;
  modoEdicion: boolean = false;
  cargando: boolean = false;
  guardando: boolean = false;
  error: string = '';
  imagenPreview: string | ArrayBuffer | null = null;
  
  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [''],
      activa: [true],
      imagen: [null]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.categoriaId = id;
        this.modoEdicion = true;
        this.cargarCategoria(id);
      }
    });
  }

  cargarCategoria(id: string) {
    this.cargando = true;
    this.categoriaService.getCategoria(id).subscribe({
      next: (categoria) => {
        this.categoriaForm.patchValue({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          activa: categoria.activa
        });
        
        if (categoria.imagen) {
          this.imagenPreview = categoria.imagen;
        }
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar la categoría:', error);
        this.error = 'No se pudo cargar la categoría. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  onImagenSeleccionada(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.categoriaForm.patchValue({ imagen: file });
      
      // Mostrar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.categoriaForm.invalid) {
      return;
    }

    this.guardando = true;
    this.error = '';

    const formData = new FormData();
    const formValue = this.categoriaForm.value;
    
    // Añadir todos los campos del formulario a formData
    Object.keys(formValue).forEach(key => {
      if (key !== 'imagen') {
        formData.append(key, formValue[key]);
      }
    });
    
    // Añadir la imagen si existe
    if (formValue.imagen instanceof File) {
      formData.append('imagen', formValue.imagen);
    }

    if (this.modoEdicion && this.categoriaId) {
      this.categoriaService.actualizarCategoria(this.categoriaId, formData).subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.router.navigate(['/admin/categorias']);
        },
        error: (error) => {
          this.guardando = false;
          console.error('Error al actualizar la categoría:', error);
          this.error = 'No se pudo actualizar la categoría. Inténtelo de nuevo.';
        }
      });
    } else {
      this.categoriaService.crearCategoria(formData).subscribe({
        next: (respuesta) => {
          this.guardando = false;
          this.router.navigate(['/admin/categorias']);
        },
        error: (error) => {
          this.guardando = false;
          console.error('Error al crear la categoría:', error);
          this.error = 'No se pudo crear la categoría. Inténtelo de nuevo.';
        }
      });
    }
  }

  volver() {
    this.router.navigate(['/admin/categorias']);
  }
}