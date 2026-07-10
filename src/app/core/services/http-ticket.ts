import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";


@Service()
export class HttpTicket {
    private http = inject(HttpClient)

    createTicket(newTicket:any) {
        return this.http.post('http://localhost:3000/api/tickets', newTicket)
    }
}