import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpGateway {

  private http = inject(HttpClient);

  // Obtener todas las pasarelas de pago
  getGateways() {
    return this.http.get('http://localhost:3000/api/gateways');
  }

  // Obtener una pasarela por ID
  getGatewayById(id: string) {
    return this.http.get(`http://localhost:3000/api/gateways/${id}`);
  }

  // Crear una nueva pasarela de pago
  createGateway(newGateway: any) {
    return this.http.post('http://localhost:3000/api/gateways', newGateway);
  }

  // Actualizar una pasarela existente
  updateGateway(id: string, gateway: any) {
    return this.http.put(`http://localhost:3000/api/gateways/${id}`, gateway);
  }

  // Eliminar una pasarela
  deleteGateway(id: string) {
    return this.http.delete(`http://localhost:3000/api/gateways/${id}`);
  }
}
