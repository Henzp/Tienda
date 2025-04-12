import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
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
        if (this.authService.esAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMensaje = 'No tienes permisos de administrador';
          this.authService.logout();
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
}