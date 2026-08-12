import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { map } from 'rxjs';
import { ResponseUsers } from '../models/users';


@Service()
export class HttpBar {
  private http = inject(HttpClient);
  //inyectar una dependencia 
  //Constructor (Private: http: HttpClient) { } //inyección de dependencias

  getBar() {
    return this.http.get<any>(`${environment.apiUrl}/bar`).pipe(
      map((res) => res.data));
  }

  createBar(eventData: any) {
    return this.http.post(`${environment.apiUrl}/bar`, eventData);
  }

}