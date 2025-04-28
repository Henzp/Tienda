import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layouts
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

// Componentes de la tienda
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
import { SelectorPerfilComponent } from './pages/selector-perfil/selector-perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CarritoService } from './services/carrito.service';  

// Componentes Admin
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductosListaComponent } from './pages/admin/productos-lista/productos-lista.component';
import { ProductoFormComponent } from './pages/admin/producto-form/producto-form.component';
import { UsuariosListaComponent } from './pages/admin/usuarios-lista/usuarios-lista.component';
import { UsuarioDetalleComponent } from './pages/admin/usuario-detalle/usuario-detalle.component';
import { CategoriasListaComponent } from './pages/admin/categorias-lista/categorias-lista.component';
import { CategoriaFormComponent } from './pages/admin/categoria-form/categoria-form.component'; 
import { CheckoutComponent } from './pages/checkout/checkout.component';


// Guard para proteger rutas admin
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  // Rutas para páginas que no necesitan layout (login, registro, etc.)
  { path: 'login', component: SelectorPerfilComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'admin/login', component: LoginComponent },
  
  // Rutas de la tienda con layout por defecto
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
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
      { path: 'perfiles', component: SelectorPerfilComponent },
      { path: 'carrito', component: CarritoComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  // Rutas de administración con layout de admin
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductosListaComponent },
      { path: 'productos/nuevo', component: ProductoFormComponent },
      { path: 'productos/editar/:id', component: ProductoFormComponent },
      { path: 'usuarios', component: UsuariosListaComponent },
      { path: 'usuarios/editar/:id', component: UsuarioDetalleComponent },
      { path: 'categorias', component: CategoriasListaComponent, canActivate: [AdminGuard] },
      { path: 'categorias/nueva', component: CategoriaFormComponent, canActivate: [AdminGuard] },
      { path: 'categorias/editar/:id', component: CategoriaFormComponent, canActivate: [AdminGuard] },
      
    ]
  },
  
  // Ruta para cualquier otra URL no definida
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }