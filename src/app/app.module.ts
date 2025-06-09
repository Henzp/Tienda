import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { MarcasBannerComponent } from './components/marcas-banner/marcas-banner.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { AccesoriosComponent } from './pages/accesorios/accesorios.component';
import { LubricantesComponent } from './pages/lubricantes/lubricantes.component';
import { NeumaticosComponent } from './pages/neumaticos/neumaticos.component';
import { RepuestosComponent } from './pages/repuestos/repuestos.component';
import { CascosComponent } from './pages/cascos/cascos.component';
import { GuantesComponent } from './pages/guantes/guantes.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { DiagnosticoComponent } from './diagnostico/diagnostico.component';


// Componentes Admin
import { LoginComponent } from './pages/admin/login/login.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { ProductosListaComponent } from './pages/admin/productos-lista/productos-lista.component';
import { ProductoFormComponent } from './pages/admin/producto-form/producto-form.component';

// Interceptor para autenticación
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { SelectorPerfilComponent } from './pages/selector-perfil/selector-perfil.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DefaultLayoutComponent } from './layouts/default-layout/default-layout.component';
import { UsuariosListaComponent } from './pages/admin/usuarios-lista/usuarios-lista.component';
import { UsuarioDetalleComponent } from './pages/admin/usuario-detalle/usuario-detalle.component';
import { CategoriasListaComponent } from './pages/admin/categorias-lista/categorias-lista.component';
import { CategoriaFormComponent } from './pages/admin/categoria-form/categoria-form.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfirmacionPedidoComponent } from './pages/confirmacion-pedido/confirmacion-pedido.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PedidoDetalleComponent } from './pages/pedido-detalle/pedido-detalle.component';
import { PedidosAdminComponent } from './pages/admin/pedidos-admin/pedidos-admin.component';

// Otros


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    MarcasBannerComponent,
    HomeComponent,
    ProductosComponent,
    ContactoComponent,
    AccesoriosComponent,
    LubricantesComponent,
    NeumaticosComponent,
    RepuestosComponent,
    CascosComponent,
    GuantesComponent,
    DetalleProductoComponent,
    DiagnosticoComponent,
    LoginComponent,
    DashboardComponent,
    ProductosListaComponent,
    ProductoFormComponent,
    SelectorPerfilComponent,
    RegistroComponent,
    AdminLayoutComponent,
    DefaultLayoutComponent,
    UsuariosListaComponent,
    UsuarioDetalleComponent,
    CategoriasListaComponent,
    CategoriaFormComponent,
    CarritoComponent,
    CheckoutComponent,
    ConfirmacionPedidoComponent,
    PedidosComponent,
    PedidoDetalleComponent,
    PedidosAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, // Añadido para formularios reactivos
    HttpClientModule,
    BrowserAnimationsModule // Añadido para animaciones
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Interceptor para autenticación
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }