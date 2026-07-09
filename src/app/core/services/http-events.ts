import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';


@Service()
export class HttpEvents {
  private http = inject(HttpClient);
//inyectar una dependencia 
//Constructor (Private: http: HttpClient) { } //inyección de dependencias

  getEvents() {
    return this.http.get<ResponseUsers>(`http://localhost:3000/api/events`).pipe(
      map( ( res) => res.data ));
  }

  createEvent (eventData: any) {
    return this.http.post(`http://localhost:3000/api/events`, eventData);
  }

}