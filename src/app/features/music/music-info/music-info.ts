import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SafeUrlPipe } from '../../../pipes/safe-url-pipe';

@Component({
  selector: 'app-music-info',
  imports: [AsyncPipe, SafeUrlPipe],
  templateUrl: './music-info.html',
  styleUrl: './music-info.css',
})
export default class MusicInfo implements OnInit {
  currentTrack = new BehaviorSubject<any>(null);
  selectedMusicId: string | null = null;
  musicList: any[] = [];
  currentTrackIndex = -1;
  isPlaying = false;
  embedUrl: string | null = null;

  private httpMusic = inject(HttpMusic);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.selectedMusicId = this.activatedRoute.snapshot.paramMap.get('id');

    // 1. Cargar la lista completa de canciones para la playlist
    this.loadPlaylistAndActiveTrack();
  }

  /**
   * Carga la lista completa y selecciona la canción adecuada
   */
  loadPlaylistAndActiveTrack() {
    // Reemplaza getMusic() por el método de tu servicio que trae todas las canciones
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        const list = res?.data || res || [];
        this.musicList = Array.isArray(list) ? list : [];

        if (this.musicList.length > 0) {
          // Si vino un ID por la ruta, buscamos su índice en la lista
          if (this.selectedMusicId) {
            const index = this.musicList.findIndex(
              (item) => (item._id || item.id) === this.selectedMusicId
            );

            if (index !== -1) {
              this.currentTrackIndex = index;
              this.currentTrack.next(this.musicList[index]);
            } else {
              // Si no coincide con ningún ID de la lista, se carga individualmente
              this.fetchSingleTrackById(this.selectedMusicId);
            }
          } else {
            // Si no hay ID en la ruta, se selecciona el primer tema por defecto
            this.currentTrackIndex = 0;
            this.currentTrack.next(this.musicList[0]);
          }
        } else if (this.selectedMusicId) {
          this.fetchSingleTrackById(this.selectedMusicId);
        }
      },
      error: (err) => {
        console.error('Error cargando la lista de reproducción:', err);
        if (this.selectedMusicId) {
          this.fetchSingleTrackById(this.selectedMusicId);
        }
      },
    });
  }

  /**
   * Carga el detalle si la canción no venía dentro del arreglo principal
   */
  fetchSingleTrackById(id: string) {
    this.httpMusic.getMusicById(id).subscribe({
      next: (res) => {
        const track = res?.data || res || null;
        this.currentTrack.next(track);
      },
      error: (err) => console.error('Error al obtener canción por ID:', err),
    });
  }

  extractVideoId(url: string): string | null {
    if (!url) return null;

    if (url.includes('<iframe')) {
      const match = url.match(/src="([^"]+)"/);
      if (match && match[1]) url = match[1];
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

    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

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
   * Reproduce una canción de la lista
   */
  playTrack(index: number) {
    if (index < 0 || index >= this.musicList.length) return;

    this.currentTrackIndex = index;
    const track = this.musicList[index];

    // Emitir la nueva canción activa
    this.currentTrack.next(track);
    this.isPlaying = true;
    this.embedUrl = this.getEmbedUrl(track);
  }

  /**
   * Alterna pausa / reproducción
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