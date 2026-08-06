import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';


@Injectable({ providedIn: 'root' })
export class HttpEvents {
  private http = inject(HttpClient);
//inyectar una dependencia 
//Constructor (Private: http: HttpClient) { } //inyección de dependencias

  getEvents() {
    return this.http.get<ResponseUsers>(`${environment.apiUrl}/events`).pipe(
      map( ( res) => res.data ));
  }

  createEvent (eventData: any) {
    return this.http.post(`${environment.apiUrl}/events`, eventData);
  }

}