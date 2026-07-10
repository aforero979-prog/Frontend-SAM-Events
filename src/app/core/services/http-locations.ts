import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpLocations {
  private http = inject(HttpClient);

  getLocations() {
    return this.http.get('http://localhost:3000/api/locations');
  }

  createLocation(locationData: any) {
    return this.http.post('http://localhost:3000/api/locations', locationData);
  }
}
