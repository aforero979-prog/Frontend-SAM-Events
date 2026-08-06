import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';

@Injectable({ providedIn: 'root' })
export class HttpUsers {
  //Inyectar una dependencia
  // constructor (private https: HttpClient) { }
  private http = inject(HttpClient);

  //Metodo para consultar la lista de usuarios
  getUsers() {
    return this.http
      .get<ResponseUsers>(`${environment.apiUrl}/users`)
      .pipe(map((res) => res.data));
  }
}
