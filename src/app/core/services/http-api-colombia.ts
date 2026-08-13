import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpApiColombia {
    private http = inject(HttpClient);
    private baseUrl = 'https://api-colombia.com/api/v1';

    // Obtener todos los departamentos / regiones
    getDepartments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/Department`);
    }

    // Obtener ciudades por ID de departamento
    getCitiesByDepartment(departmentId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/Department/${departmentId}/cities`);
    }

    // Obtener todas las ciudades (opcional)
    getAllCities(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/City`);
    }
}
