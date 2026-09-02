import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponsePosts } from '../models/post';
import { environment } from '../../../environments/environment';

// servicio para obtener las publicaciones
@Injectable({
  providedIn: 'root'
})
export class HttpPost {

  private http = inject(HttpClient);

  //Url de la API
  BASE_URL: string = environment.apiUrl;

  // Obtener todas las publicaciones
  getPosts() {
    return this.http.get<ResponsePosts>(this.BASE_URL + '/posts').pipe(
      map((response: ResponsePosts) => {
        return response.data;
      })
    );
  }

  // Obtener una publicacion por ID
  getPostById(id: string) {
    return this.http.get<ResponsePosts>(this.BASE_URL + '/posts/' + id);
  }

  // Crear una nueva publicacion
  createPost(newPost: any) {
    return this.http.post<ResponsePosts>(this.BASE_URL + '/posts', newPost);
  }

  // Actualizar una publicacion existente
  updatePost(id: string, post: any) {
    return this.http.put<ResponsePosts>(this.BASE_URL + '/posts/' + id, post);
  }

  // Eliminar una publicacion
  deletePost(id: string) {
    return this.http.delete(this.BASE_URL + '/posts/' + id);
  }
}
