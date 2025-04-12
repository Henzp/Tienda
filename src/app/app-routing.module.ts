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
import { DiagnosticoComponent } from './diagnostico/diagnostico.component';

// Componentes Admin
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductosListaComponent } from './pages/admin/productos-lista/productos-lista.component';
import { ProductoFormComponent } from './pages/admin/producto-form/producto-form.component';

// Guard para proteger rutas admin
import { AdminGuard } from './guards/admin.guard';

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
  { path: 'producto/:id', component: DetalleProductoComponent },
  { path: 'diagnostico', component: DiagnosticoComponent },
  
  // Rutas Admin
  { path: 'admin/login', component: LoginComponent },
  { 
    path: 'admin', 
    component: DashboardComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: 'productos', component: ProductosListaComponent },
      { path: 'productos/nuevo', component: ProductoFormComponent },
      { path: 'productos/editar/:id', component: ProductoFormComponent }
    ]
  },
  
  // Redirección de rutas 
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }