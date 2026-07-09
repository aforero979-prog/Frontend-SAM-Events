import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz que representa un usuario creado/recibido del backend
export interface User {
  id?:       string;
  name:      string;
  email:     string;
  password?: string;
  role:      string;
  avatar?:   string;
  isActive?: boolean;
}

// Respuesta genérica de la API
interface ApiResponse<T> {
  msg:  string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class HttpUser {

  // URL base del backend
  private readonly baseUrl = 'http://localhost:3000/api/users';

  // Inyección del cliente HTTP de Angular
  private http = inject(HttpClient);

  // Obtener todos los usuarios
  getAll(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.baseUrl);
  }

  // Obtener un usuario por ID
  getById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo usuario
  create(user: User): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.baseUrl, user);
  }

  // Actualizar un usuario existente
  update(id: string, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, user);
  }

  // Eliminar un usuario
  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`);
  }
}
