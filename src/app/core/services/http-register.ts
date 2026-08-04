import { HttpClient } from "@angular/common/http";
import { inject, Service } from "@angular/core";

@Service()

export class HttpRegister {
    private http = inject(HttpClient)

    createUser(registerData: any) {
        return this.http.post('http://localhost:3000/api/register', registerData)
    }
}