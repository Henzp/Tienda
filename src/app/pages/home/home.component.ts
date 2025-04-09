import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  heroImageUrl: string = 'assets/moto-hero.jpg';
  heroBackgroundStyle: string = '';

  constructor() { }

  ngOnInit(): void {
    // Construye el estilo completo para el fondo, incluyendo el gradiente
    this.heroBackgroundStyle = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.heroImageUrl})`;
  }
}