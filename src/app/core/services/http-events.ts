import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpEvents {
  private http = inject(HttpClient);

  getEvents() {
    return this.http.get<any>(`${environment.apiUrl}/events`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || [])),
      catchError((error) => {
        console.error('Error fetching events:', error);
        const errorMessage = error?.error?.message || 'Error al obtener los eventos';
        return throwError(() => errorMessage); // Rethrow the error to be handled by the subscriber
      }
    ))
  }

  getFeaturedEvents( quantity: number ) {
    return this.http.get<any>(`${environment.apiUrl}/events?isFeatured=true&limit=${quantity}`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || [])),
          catchError((error) => {
          console.error('Error fetching events:', error);
          const errorMessage = error?.error?.message || 'Error al obtener los eventos';
          return throwError(() => errorMessage); // Rethrow the error to be handled by the subscriber
        }
      ))
  }

  getEventsByField(field: string, quantity: number) {
    return this.http.get<any>(`${environment.apiUrl}/events?sortByField=${field}&limit=${quantity}`).pipe(
      map((res) => (Array.isArray(res) ? res : res?.data || [])),
      catchError((error) => {
        console.error('Error fetching events:', error);
        const errorMessage = error?.error?.message || 'Error al obtener los eventos';
        return throwError(() => errorMessage);
      })
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