import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpEvents {
  private http = inject(HttpClient);

  getEvents() {
    return this.http.get<any>(`${environment.apiUrl}/events`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || []))
    );
  }

  getEventById(id: string | null) {
    return this.http.get<any>(`${environment.apiUrl}/events/${id}`);
  }

  createEvent(eventData: any) {
    return this.http.post<any>(`${environment.apiUrl}/events`, eventData);
  }

  updateEvent(id: string | null, eventData: any) {
    return this.http.patch<any>(`${environment.apiUrl}/events/${id}`, eventData);
  }

  deleteEvent(id: string | null) {
    return this.http.delete<any>(`${environment.apiUrl}/events/${id}`);
  }
}