import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpPost } from '../../../core/services/http-post';

@Component({
  selector: 'app-post-public-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  templateUrl: './post-public-list.html',
  styleUrl: './post-public-list.css'
})
export default class PostPublicList implements OnInit {
  publicPosts$ = new BehaviorSubject<any[]>([]);
  private httpPost = inject(HttpPost);

  ngOnInit() {
    this.httpPost.getPosts().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        // Solo mostrar posts activos
        const activePosts = list.filter((post: any) => post.isActive);
        this.publicPosts$.next(activePosts);
      },
      error: (err: any) => console.error('Error cargando posts públicos', err)
    });
  }
}
