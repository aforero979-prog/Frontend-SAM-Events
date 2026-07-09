import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpEvents {
    private http = inject(HttpClient)


    createEvent(newEvent:any) {
        return this.http.post('http://localhost:3000/api/events', newEvent)
    }
}
