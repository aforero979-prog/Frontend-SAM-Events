import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class HttpUser {

  private http = inject(HttpClient);
  //Url de la API
  BASE_URL: string = environment.apiUrl; 

  // Obtener todos los usuarios (extrae res.data automáticamente)
  getUsers() {
    return this.http
      .get<ResponseUsers>(`${this.BASE_URL}/users`)
      .pipe(map((res) => res.data));
  }

  // Obtener un usuario por ID
  getUserById(id: string) {
    return this.http.get(`${this.BASE_URL}/users/${id}`);
  }

  // Crear un nuevo usuario
  createUser(newUser: any) {
    return this.http.post(`${this.BASE_URL}/users`, newUser);
  }

  // Actualizar un usuario existente
  updateUser(id: string, user: any) {
    return this.http.patch(`${this.BASE_URL}/users/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: string) {
    return this.http.delete(`${this.BASE_URL}/users/${id}`);
  }
}
