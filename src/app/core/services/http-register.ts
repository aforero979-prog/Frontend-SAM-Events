import { environment } from '../../../environments/environment.development';
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class HttpRegister {
    private http = inject(HttpClient)

    createUser(registerData: any) {
        return this.http.post(`${environment.apiUrl}/auth/register`, registerData)
    }
}