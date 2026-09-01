import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { SafeUrlPipe } from '../../../pipes/safe-url-pipe';

@Component({
  selector: 'app-music-home',
  imports: [RouterLink, AsyncPipe, SafeUrlPipe, NgIf],
  templateUrl: './music-home.html',
  styleUrl: './music-home.css',
})

export default class MusicHome implements OnInit {

  musicList: any[] = [];
  currentTrackIndex = -1;
  isPlaying = false;
  embedUrl: string | null = null;

  private httpMusic = inject(HttpMusic);
  private router = inject(Router);

  ngOnInit() {
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        this.musicList = list;
        // Auto-seleccionar primer track sin reproducir
        if (list.length > 0) {
          this.currentTrackIndex = 0;
        }
      },
      error: (err) => {
        console.error('Error cargando música:', err);
      }
    });
  }

  get currentTrack(): any {
    if (this.currentTrackIndex >= 0 && this.currentTrackIndex < this.musicList.length) {
      return this.musicList[this.currentTrackIndex];
    }
    return null;
  }

  /**
   * Extrae el videoId de una URL de YouTube
   */
  extractVideoId(url: string): string | null {
    if (!url) return null;

    // Manejo de iframes embebidos
    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) {
        url = match[1];
      }
    }

    // youtu.be/XXXX
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // youtube.com/watch?v=XXXX
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // youtube.com/embed/XXXX
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    return null;
  }

  /**
   * Genera la URL del thumbnail de YouTube
   */
  getThumbnail(music: any): string {
    const videoId = this.extractVideoId(music.youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return music.imageUrl || '';
  }

  /**
   * Genera la URL del thumbnail de alta resolución para el player principal
   */
  getHeroThumbnail(music: any): string {
    const videoId = this.extractVideoId(music.youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return music.imageUrl || '';
  }

  /**
   * Genera la URL de embed de YouTube con autoplay
   */
  getEmbedUrl(music: any): string | null {
    const videoId = this.extractVideoId(music.youtubeUrl);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return null;
  }

  /**
   * Selecciona y reproduce un track
   */
  playTrack(index: number) {
    this.currentTrackIndex = index;
    this.isPlaying = true;
    const track = this.musicList[index];
    this.embedUrl = this.getEmbedUrl(track);
  }

  /**
   * Pausa la reproducción (oculta el iframe)
   */
  togglePlay() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.embedUrl = null;
    } else if (this.currentTrack) {
      this.isPlaying = true;
      this.embedUrl = this.getEmbedUrl(this.currentTrack);
    }
  }

  /**
   * Track anterior
   */
  prevTrack() {
    if (this.musicList.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.musicList.length) % this.musicList.length;
    if (this.isPlaying) {
      this.embedUrl = this.getEmbedUrl(this.currentTrack);
    }
  }

  /**
   * Siguiente track
   */
  nextTrack() {
    if (this.musicList.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicList.length;
    if (this.isPlaying) {
      this.embedUrl = this.getEmbedUrl(this.currentTrack);
    }
  }
}
