import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';

@Service()
export class HttpUser {

  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/users';

  // Obtener todos los usuarios (extrae res.data automáticamente)
  getUsers() {
    return this.http
      .get<ResponseUsers>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  // Obtener un usuario por ID
  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo usuario
  createUser(newUser: any) {
    return this.http.post(this.baseUrl, newUser);
  }

  // Actualizar un usuario existente
  updateUser(id: string, user: any) {
    return this.http.patch(`${this.baseUrl}/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
