import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  styleUrls: ['./usuarios-lista.component.css']
})
export class UsuariosListaComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  searchTerm: string = '';
  cargando: boolean = true;
  error: string = '';
  
  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    // Corregido - quitamos la referencia a apiUrl 
    console.log('Solicitando usuarios...');
    this.adminService.getUsuarios().subscribe({
      next: (usuarios) => {
        console.log('Usuarios recibidos:', usuarios);
        this.usuarios = usuarios;
        this.usuariosFiltrados = [...usuarios];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'No se pudieron cargar los usuarios. Inténtelo de nuevo.';
        this.cargando = false;
      }
    });
  }

  filtrarUsuarios() {
    if (!this.searchTerm) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(term) || 
      usuario.email.toLowerCase().includes(term) ||
      usuario.rol.toLowerCase().includes(term)
    );
  }

  editarUsuario(id: string) {
    this.router.navigate(['/admin/usuarios/editar', id]);
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.adminService.eliminarUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(usuario => usuario._id !== id);
          this.filtrarUsuarios();
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.error = 'No se pudo eliminar el usuario. Inténtelo de nuevo.';
        }
      });
    }
  }
}