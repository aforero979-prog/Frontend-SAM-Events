import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpUser {

  private http = inject(HttpClient);

  // Obtener todos los usuarios
  getUsers() {
    return this.http.get('http://localhost:3000/api/users');
  }

  // Obtener un usuario por ID
  getUserById(id: string) {
    return this.http.get(`http://localhost:3000/api/users/${id}`);
  }

  // Crear un nuevo usuario
  createUser(newUser: any) {
    return this.http.post('http://localhost:3000/api/users', newUser);
  }

  // Actualizar un usuario existente
  updateUser(id: string, user: any) {
    return this.http.put(`http://localhost:3000/api/users/${id}`, user);
  }

  // Eliminar un usuario
  deleteUser(id: string) {
    return this.http.delete(`http://localhost:3000/api/users/${id}`);
  }
}
