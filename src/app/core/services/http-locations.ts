import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpLocations {
  private http = inject(HttpClient);

  getLocations() {
    return this.http.get(`${environment.apiUrl}/locations`);
  }

  createLocation(locationData: any) {
    return this.http.post(`${environment.apiUrl}/locations`, locationData);
  }
}
