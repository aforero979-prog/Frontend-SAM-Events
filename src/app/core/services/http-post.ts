import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class HttpPost {

  private http = inject(HttpClient);

  // Obtener todas las publicaciones
  getPosts() {
    return this.http.get('http://localhost:3000/api/posts');
  }

  // Obtener una publicacion por ID
  getPostById(id: string) {
    return this.http.get(`http://localhost:3000/api/posts/${id}`);
  }

  // Crear una nueva publicacion
  createPost(newPost: any) {
    return this.http.post('http://localhost:3000/api/posts', newPost);
  }

  // Actualizar una publicacion existente
  updatePost(id: string, post: any) {
    return this.http.put(`http://localhost:3000/api/posts/${id}`, post);
  }

  // Eliminar una publicacion
  deletePost(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }
}
