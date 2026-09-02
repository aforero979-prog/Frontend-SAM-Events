import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class HttpTicket {
    private http = inject(HttpClient)

    getTickets() {
        return this.http.get(`${environment.apiUrl}/tickets`);
    }

    getTicketById(id: string) {
        return this.http.get(`${environment.apiUrl}/tickets/${id}`);
    }

    createTicket(newTicket: any) {
        return this.http.post(`${environment.apiUrl}/tickets`, newTicket)
    }

    updateTicket(id: string, ticket: any) {
        return this.http.patch(`${environment.apiUrl}/tickets/${id}`, ticket);
    }

    deleteTicket(id: string) {
        return this.http.delete(`${environment.apiUrl}/tickets/${id}`);
    }
}
