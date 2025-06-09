import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-selector-perfil',
  templateUrl: './selector-perfil.component.html',
  styleUrls: ['./selector-perfil.component.css']
})
export class SelectorPerfilComponent implements OnInit {
  loginForm: FormGroup;
  errorMensaje: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir a la tienda
    if (this.authService.estaLogueado()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        
        // Si es admin, redirigir al panel de admin
        if (this.authService.esAdmin()) {
          this.router.navigate(['/admin/productos']);
        } else {
          // Si es usuario normal, redirigir a la tienda
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.cargando = false;
        if (error.status === 404) {
          this.errorMensaje = 'Usuario no encontrado';
        } else if (error.status === 401) {
          this.errorMensaje = 'Contraseña incorrecta';
        } else {
          this.errorMensaje = 'Error al iniciar sesión';
        }
      }
    });
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}