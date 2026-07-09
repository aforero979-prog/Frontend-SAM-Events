import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategory {
    private http = inject( HttpClient )

    //Metodo para obtener todas las categorias

    getCategories () {
        return this.http.get('http://localhost:3000/api/categories')
    }
}
