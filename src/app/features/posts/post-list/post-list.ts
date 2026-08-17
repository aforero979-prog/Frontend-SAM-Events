import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpPost } from '../../../core/services/http-post';

@Component({
  selector: 'app-post-list',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export default class PostList implements OnInit {
  postList$ = new BehaviorSubject<any[]>([]);
  private httpPost = inject(HttpPost);
  private router = inject(Router);

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.httpPost.getPosts().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.postList$.next(list);
      },
      error: (err) => console.error('Error cargando posts', err),
    });
  }

  onDelete(id: string) {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    if (!this.pendingDeleteId) return;
    this.httpPost.deletePost(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadPosts();
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => console.error('Error eliminando post', err),
    });
    this.pendingDeleteId = '';
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }

  onEdit(id: string) {
    this.router.navigateByUrl(`/dashboard/post/edit/${id}`);
  }
}
