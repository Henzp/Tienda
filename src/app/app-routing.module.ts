import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { AccesoriosComponent } from './pages/accesorios/accesorios.component';
import { NeumaticosComponent } from './pages/neumaticos/neumaticos.component';
import { LubricantesComponent } from './pages/lubricantes/lubricantes.component';
import { RepuestosComponent } from './pages/repuestos/repuestos.component';
import { CascosComponent } from './pages/cascos/cascos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { GuantesComponent } from './pages/guantes/guantes.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'accesorios', component: AccesoriosComponent },
  { path: 'neumaticos', component: NeumaticosComponent },
  { path: 'lubricantes', component: LubricantesComponent },
  { path: 'repuestos', component: RepuestosComponent },
  { path: 'cascos', component: CascosComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'guantes', component: GuantesComponent },
  { path: 'producto/:id', component: DetalleProductoComponent }, // Cambié de 'detalle/:id' a 'producto/:id'
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }