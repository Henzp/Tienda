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
    { nombre: 'Alpinestars', logo: 'assets/marcas/continental.jpg' },
    { nombre: 'Shoei', logo: 'assets/marcas/ferodo.jpg' },
    { nombre: 'Pirelli', logo: 'assets/marcas/regina.jpg' },
    { nombre: 'Dunlop', logo: 'assets/marcas/rk.jpg' },
    { nombre: 'Fox Racing', logo: 'assets/marcas/vrooam.jpg' },
  ];
}