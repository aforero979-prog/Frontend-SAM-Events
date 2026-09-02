import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpSupport {
  private http = inject(HttpClient);

  createTicket(ticketData: any) {
    return this.http.post<any>(`${environment.apiUrl}/support`, ticketData);
  }
}
