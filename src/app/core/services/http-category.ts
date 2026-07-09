import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategory {
    private http = inject( HttpClient )

    //Metodo para obtener todas las categorias

    createCategories (newCategory:any) {
        return this.http.post('http://localhost:3000/api/categories', newCategory)
    }                          
}
