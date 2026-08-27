import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';

@Component({
  selector: 'app-music-list',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './music-list.html',
  styleUrl: './music-list.css',
})
export default class MusicList implements OnInit {
  musicList$ = new BehaviorSubject<any[]>([]);
  private httpMusic = inject(HttpMusic);
  private router = inject(Router);

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';

  ngOnInit() {
    this.loadMusic();
  }

  loadMusic() {
    this.httpMusic.getMusic().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.musicList$.next(list);
      },
      error: (err) => console.error('Error cargando música', err),
    });
  }

  onDelete(id: string) {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    if (!this.pendingDeleteId) return;
    this.httpMusic.deleteMusic(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadMusic();
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => console.error('Error eliminando música', err),
    });
    this.pendingDeleteId = '';
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }

  onEdit(id: string) {
    this.router.navigateByUrl(`/dashboard/music/edit/${id}`);
  }
}
