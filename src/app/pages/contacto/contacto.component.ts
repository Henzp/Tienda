import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  contactoForm!: FormGroup; // Usando el operador ! para asegurar a TypeScript que será inicializado
  submitted = false;
  mensajeEnviado = false;
  enviando = false;
  error = false;
  mensajeError = '';

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService
  ) { }

  ngOnInit(): void {
    // Inicialización del formulario en ngOnInit
    this.contactoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', Validators.required]
    });
  }

  // Removido el getter f() que causaba problemas de tipado

  enviarMensaje() {
    this.submitted = true;
    
    // Detener si el formulario es inválido
    if (this.contactoForm.invalid) {
      return;
    }
    
    this.enviando = true;
    this.error = false;
    
    this.contactoService.enviarMensaje(this.contactoForm.value)
      .subscribe({
        next: (respuesta) => {
          this.enviando = false;
          this.mensajeEnviado = true;
          this.contactoForm.reset();
          this.submitted = false;
          
          // Resetear el mensaje después de 5 segundos
          setTimeout(() => {
            this.mensajeEnviado = false;
          }, 5000);
        },
        error: (error) => {
          this.enviando = false;
          this.error = true;
          this.mensajeError = error.error?.mensaje || 'Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo más tarde.';
        }
      });
  }
}