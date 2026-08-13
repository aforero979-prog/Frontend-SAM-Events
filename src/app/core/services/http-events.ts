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

  getEventById(id: string) {
    return this.http.get(`${environment.apiUrl}/events/${id}`);
  }

  createEvent(eventData: any) {
    return this.http.post(`${environment.apiUrl}/events`, eventData);
  }

  updateEvent(id: string, eventData: any) {
    return this.http.patch(`${environment.apiUrl}/events/${id}`, eventData);
  }

  deleteEvent(id: string) {
    return this.http.delete(`${environment.apiUrl}/events/${id}`);
  }
}