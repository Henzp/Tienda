import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {
  mensajes: string[] = [
    '¡Descuento de 8% en clientes nuevos!',
    '¡Envío gratis en compras sobre $50.000!',
    '¡Nuevos productos cada semana!',
    '¡Garantía en todos nuestros productos!'
  ];
  
  mensajeActual: string = '';
  posicionMensaje: number = 0;
  opacidadMensaje: number = 1;
  indiceActual: number = 0;
  private intervalo: any;

  ngOnInit(): void {
    // Iniciar con el primer mensaje
    this.mensajeActual = this.mensajes[0];
    
    // Cambiar mensajes cada 4 segundos
    this.intervalo = setInterval(() => {
      this.animarCambioMensaje();
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  animarCambioMensaje(): void {
    // Primero, animamos la salida del mensaje actual
    this.posicionMensaje = -100;
    this.opacidadMensaje = 0;
    
    // Después de un breve retraso, cambiamos al siguiente mensaje
    setTimeout(() => {
      this.indiceActual = (this.indiceActual + 1) % this.mensajes.length;
      this.mensajeActual = this.mensajes[this.indiceActual];
      
      // Preparamos la entrada del nuevo mensaje desde la derecha
      this.posicionMensaje = 100;
      
      // Pequeño retraso para que se aplique el cambio de posición
      setTimeout(() => {
        // Animamos la entrada del nuevo mensaje
        this.posicionMensaje = 0;
        this.opacidadMensaje = 1;
      }, 50);
    }, 500);
  }
}