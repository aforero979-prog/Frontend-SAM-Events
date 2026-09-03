import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBar {
  private http = inject(HttpClient);

  getBars() {
    return this.http.get<any>(`${environment.apiUrl}/bars`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || []))
    );
  }

    getBarsByField(quantity: number) {
      return this.http.get<any>(`${environment.apiUrl}/bars?limit=${quantity}`).pipe(
        map((res) => (Array.isArray(res) ? res : res?.data || [])),
        catchError((error) => {
          console.error('Error fetching bars:', error);
          const errorMessage = error?.error?.message || 'Error al obtener los bares';
          return throwError(() => errorMessage);
        })
      );
    }

  getBarById(id: string | null ) {
    return this.http.get<any>(`${environment.apiUrl}/bars/${id}`);
  }

  createBar(barData: any) {
    return this.http.post(`${environment.apiUrl}/bars`, barData);
  }

  updateBar(id: string | null, barData: any) {
    return this.http.patch<any>(`${environment.apiUrl}/bars/${id}`, barData);
  }

  deleteBar(id: string) {
    return this.http.delete(`${environment.apiUrl}/bars/${id}`);
  }

  getBarByUserId(userId: string) {
    return this.http.get<any>(`${environment.apiUrl}/bars/user/${userId}`);
  }
}

