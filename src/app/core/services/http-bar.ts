import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBar {
  private http = inject(HttpClient);

  getBars() {
    return this.http.get<any>(`${environment.apiUrl}/bars`).pipe(
      map((res) => res.data));
  }

  getBarById(id: string) {
    return this.http.get(`${environment.apiUrl}/bars/${id}`);
  }

  createBar(barData: any) {
    return this.http.post(`${environment.apiUrl}/bars`, barData);
  }

  updateBar(id: string, barData: any) {
    return this.http.patch(`${environment.apiUrl}/bars/${id}`, barData);
  }

  deleteBar(id: string) {
    return this.http.delete(`${environment.apiUrl}/bars/${id}`);
  }
}
