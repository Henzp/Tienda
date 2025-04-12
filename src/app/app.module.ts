import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
    DiagnosticoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }