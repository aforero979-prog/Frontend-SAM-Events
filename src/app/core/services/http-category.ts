import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpCategory {
    private http = inject( HttpClient )

    //Metodo para obtener todas las categorias

    getCategories () {
        return this.http.get('http://localhost:3000/api/categories')
    }

    createCategory( newCategory: any) {
        return this.http.post( 'http://localhost:3000/api/categories', newCategory )
    }

    deleteCategoryById ( id: String ) { 
        return this.http.delete( `http://localhost:3000/api/categories/${id}` )  
    }

    updataCategoryById( id: string, updateCategory: any ) {
        return this.http.patch( `http://localhost:3000/api/categories/${id}`, updateCategory )
    }
}
