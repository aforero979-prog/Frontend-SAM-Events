import { environment } from '../../../environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que representa un rol del sistema
export interface Role {
  id: string; // ej: "admin" | "user" | "company"
  name: string; // ej: "Administrador" | "Usuario" | "Empresa"
}

// Respuesta genérica de la API
interface ApiResponse<T> {
  msg: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class HttpRolesUser {

  // URL del endpoint de roles en el backend
  private readonly baseUrl = `${environment.apiUrl}/roles`;

  // Inyección del cliente HTTP de Angular
  private http = inject(HttpClient);

  // Obtener todos los roles disponibles en el sistema
  getAll(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(this.baseUrl);
  }
}
