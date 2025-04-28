import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = environment.apiUrl + '/pedidos';

  constructor(private http: HttpClient) { }

  // Crear un nuevo pedido
  crearPedido(pedidoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pedidoData);
  }

  // Obtener todos los pedidos del usuario
  getMisPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mis-pedidos`);
  }

  // Obtener un pedido específico
  getPedido(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mis-pedidos/${id}`);
  }

  // Calcular costo de envío según método y total
  calcularCostoEnvio(metodo: string, subtotal: number): number {
    if (metodo === 'express') {
      // Envío express: $5000 o 5% del subtotal (el que sea mayor)
      return Math.max(5000, subtotal * 0.05);
    } else {
      // Envío estándar: Gratis para compras mayores a $50000, de lo contrario $3000
      return subtotal > 50000 ? 0 : 3000;
    }
  }
}