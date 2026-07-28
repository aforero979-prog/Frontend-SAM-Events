import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class HttpCategory {
    private http = inject( HttpClient )

    BASE_URL: string = environment.apiUrl
    //Metodo para obtener todas las categorias

    getCategories () {
        return this.http.get<any>( `${ this.BASE_URL }/categories` )
    }

    createCategory ( newCategory: any) {
        return this.http.post<any>( `${ this.BASE_URL }/categories`, newCategory )
    }

    deleteCategoryById ( id: String ) { 
        return this.http.delete<any>( `${ this.BASE_URL }/categories/${id}` )  
    }

    updateCategoryById ( id: string | null, updateCategory: any ) {
        //Http siempre devuelve los datos dentro de un Observable
        return this.http.patch<any>( `${ this.BASE_URL }/categories/${id}`, updateCategory )
    }

    getCategoryById ( id: string | null) {
        return this.http.get<any>( `${ this.BASE_URL }/categories/${id}` )
    }

}
