import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map, pipe } from 'rxjs';
import { ResponseUsers } from './models/users';

@Service()
export class HttpUsers {
  //Inyectar una dependencia
  // constructor (private https: HttpClient) { }
  private http = inject(HttpClient);

  //Metodo para consultar la lista de usuarios
  getUsers() {
    return this.http
      .get<ResponseUsers>('http://localhost:3000/api/users')
      .pipe(map((res) => res.data));
  }
}
