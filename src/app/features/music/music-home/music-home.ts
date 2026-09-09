import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SafeUrlPipe } from '../../../pipes/safe-url-pipe';

@Component({
  selector: 'app-music-home',
  imports: [RouterLink, AsyncPipe, SafeUrlPipe],
  templateUrl: './music-home.html',
  styleUrl: './music-home.css',
})
export default class MusicHome implements OnInit {
  currentTrack = new BehaviorSubject<any>(null);
  musicList: any[] = [];
  currentTrackIndex = -1;
  isPlaying = false;
  embedUrl: string | null = null;

  private httpMusic = inject(HttpMusic);

  ngOnInit() {
    this.loadAllMusic();
  }

  /**
   * Carga todo el catálogo de música
   */
  loadAllMusic() {
    // Cambia getMusic() por el método de tu servicio que trae la lista completa (ej: getAllMusic(), getMusicList(), etc.)
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        console.log('CATÁLOGO DE MÚSICA:', res);
        
        // Asignamos la lista devuelta
        const list = res?.data || res || [];
        this.musicList = Array.isArray(list) ? list : [];

        // Si existen canciones, seleccionamos la primera por defecto
        if (this.musicList.length > 0) {
          this.currentTrackIndex = 0;
          this.currentTrack.next(this.musicList[0]);
        }
      },
      error: (err) => {
        console.error('Error cargando el catálogo de música:', err);
      },
    });
  }

  extractVideoId(url: string): string | null {
    if (!url) return null;

    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) {
        url = match[1];
      }
    }

    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    const liveMatch = url.match(/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];

    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    return null;
  }

  getThumbnail(music: any): string {
    if (!music) return '';
    const videoId = this.extractVideoId(music.youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : (music.imageUrl || '');
  }

  getHeroThumbnail(music: any): string {
    if (!music) return '';
    const videoId = this.extractVideoId(music.youtubeUrl);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : (music.imageUrl || '');
  }

  getEmbedUrl(music: any): string | null {
    if (!music) return null;
    const videoId = this.extractVideoId(music.youtubeUrl);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;
  }

  /**
   * Selecciona y reproduce un track de la playlist
   */
  playTrack(index: number) {
    if (index < 0 || index >= this.musicList.length) return;

    this.currentTrackIndex = index;
    const track = this.musicList[index];

    // Emitimos el nuevo track al BehaviorSubject para actualizar la vista principal
    this.currentTrack.next(track);
    this.isPlaying = true;
    this.embedUrl = this.getEmbedUrl(track);
  }

  /**
   * Alterna reproducir / pausar
   */
  togglePlay() {
    const activeTrack = this.currentTrack.getValue();

    if (this.isPlaying) {
      this.isPlaying = false;
      this.embedUrl = null;
    } else if (activeTrack) {
      this.isPlaying = true;
      this.embedUrl = this.getEmbedUrl(activeTrack);
    }
  }

  /**
   * Pista anterior
   */
  prevTrack() {
    if (this.musicList.length === 0) return;
    const prevIndex = (this.currentTrackIndex - 1 + this.musicList.length) % this.musicList.length;
    this.playTrack(prevIndex);
  }

  /**
   * Siguiente pista
   */
  nextTrack() {
    if (this.musicList.length === 0) return;
    const nextIndex = (this.currentTrackIndex + 1) % this.musicList.length;
    this.playTrack(nextIndex);
  }
}