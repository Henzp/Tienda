import { Component } from '@angular/core';

interface Marca {
  nombre: string;
  logo: string;
}

@Component({
  selector: 'app-marcas-banner',
  templateUrl: './marcas-banner.component.html',
  styleUrls: ['./marcas-banner.component.css']
})
export class MarcasBannerComponent {
  marcas: Marca[] = [
    { nombre: 'Continental', logo: 'assets/marcas/continental.jpg' },
    { nombre: 'Ferodo', logo: 'assets/marcas/ferodo.jpg' },
    { nombre: 'Regina', logo: 'assets/marcas/regina.jpg' },
    { nombre: 'RK', logo: 'assets/marcas/rk.jpg' },
    { nombre: 'Vrooam', logo: 'assets/marcas/vrooam.jpg' },
    { nombre: 'Dunlop', logo: 'assets/marcas/dunlop.svg' },
    { nombre: 'Sunstars', logo: 'assets/marcas/Sunstars.jpg'}
  ];
}