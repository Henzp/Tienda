import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html',
  styleUrls: ['./usuario-detalle.component.css']
})
export class UsuarioDetalleComponent implements OnInit {
  usuarioForm: FormGroup;
  usuarioId: string | null = null;
  cargando: boolean = false;
  guardando: boolean = false;
  error: string = '';
  
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Inicializar el formulario
    this.usuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['usuario', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener el ID del usuario de la URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.usuarioId = id;
        this.cargarUsuario(id);
      }
    });
  }

  cargarUsuario(id: string) {
    this.cargando = true;
    this.adminService.getUsuario(id).subscribe({
      next: (usuario) => {
        // Rellenar el formulario con los datos del usuario
        this.usuarioForm.patchValue({
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el usuario:', error);
        this.error = 'No se pudo cargar la información del usuario';
        this.cargando = false;
      }
    });
  }

  onSubmit() {
    if (this.usuarioForm.invalid) {
      return;
    }

    this.guardando = true;
    this.error = '';

    if (!this.usuarioId) {
      this.error = 'ID de usuario no válido';
      this.guardando = false;
      return;
    }

    const userData = this.usuarioForm.value;

    this.adminService.actualizarUsuario(this.usuarioId, userData).subscribe({
      next: (response) => {
        this.guardando = false;
        // Redirigir a la lista de usuarios
        this.router.navigate(['/admin/usuarios']);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.error = 'No se pudo actualizar el usuario. Inténtelo de nuevo.';
        this.guardando = false;
      }
    });
  }

  volver() {
    this.router.navigate(['/admin/usuarios']);
  }
}