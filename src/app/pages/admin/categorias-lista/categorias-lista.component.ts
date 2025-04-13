import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-categorias-lista',
  templateUrl: './categorias-lista.component.html',
  styleUrls: ['./categorias-lista.component.css']
})
export class CategoriasListaComponent implements OnInit {
  categorias: any[] = [];
  cargando: boolean = true;
  error: string = '';
  
  constructor(
    private categoriaService: CategoriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.cargando = true;
    this.categoriaService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.error = 'No se pudieron cargar las categorías. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  nuevaCategoria() {
    this.router.navigate(['/admin/categorias/nueva']);
  }

  editarCategoria(id: string) {
    this.router.navigate(['/admin/categorias/editar', id]);
  }

  eliminarCategoria(id: string) {
    if (confirm('¿Está seguro que desea eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter(categoria => categoria._id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.error = 'No se pudo eliminar la categoría. Inténtelo de nuevo.';
        }
      });
    }
  }

  handleImageError(event: any) {
    event.target.src = '/assets/placeholder-categoria.jpg';
  }
}