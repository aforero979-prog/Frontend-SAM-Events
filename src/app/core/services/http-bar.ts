import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpBar {
  private http = inject(HttpClient);

  getBars() {
    return this.http.get<any>(`${environment.apiUrl}/bars`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || []))
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
}

