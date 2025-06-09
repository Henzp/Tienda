import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Envía un mensaje de contacto al backend
   * @param mensajeData Datos del formulario de contacto
   */
  enviarMensaje(mensajeData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/contacto`, mensajeData);
  }
}