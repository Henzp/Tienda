import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  errorMensaje: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      return;
    }

    this.cargando = true;
    this.errorMensaje = '';

    const { nombre, email, password } = this.registroForm.value;

    this.authService.registro(nombre, email, password).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        // Redirigir a la tienda después de un registro exitoso
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.cargando = false;
        if (error.status === 400) {
          this.errorMensaje = 'El email ya está registrado';
        } else {
          this.errorMensaje = 'Error al registrar usuario';
        }
      }
    });
  }
}