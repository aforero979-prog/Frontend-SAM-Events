import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpGateway {

  private http = inject(HttpClient);

  // Obtener todas las pasarelas de pago
  getGateways() {
    return this.http.get(`${environment.apiUrl}/gateways`);
  }

  // Obtener una pasarela por ID
  getGatewayById(id: string) {
    return this.http.get(`${environment.apiUrl}/gateways/${id}`);
  }

  // Crear una nueva pasarela de pago
  createGateway(newGateway: any) {
    return this.http.post(`${environment.apiUrl}/gateways`, newGateway);
  }

  // Actualizar una pasarela existente
  updateGateway(id: string, gateway: any) {
    return this.http.put(`${environment.apiUrl}/gateways/${id}`, gateway);
  }

  // Eliminar una pasarela
  deleteGateway(id: string) {
    return this.http.delete(`${environment.apiUrl}/gateways/${id}`);
  }
}
