import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpRoles {
  private http = inject(HttpClient);

  getRoles() {
    return this.http.get<any>(`http://localhost:3000/api/roles`).pipe(
      map((res) => res.data)
    );
  }
}
