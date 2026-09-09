import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SafeUrlPipe } from '../../../pipes/safe-url-pipe';

@Component({
  selector: 'app-music-info',
  imports: [AsyncPipe, SafeUrlPipe, RouterLink],
  templateUrl: './music-info.html',
  styleUrl: './music-info.css',
})
export default class MusicInfo {
  currentTrack = new BehaviorSubject<any>(null);
  selectedMusicId: string | null = null;
  musicList: any[] = [];
  currentTrackIndex = -1;
  isPlaying = false;
  embedUrl: string | null = null;
  music$ = new BehaviorSubject<any>({});
  selectedId!: string | null;

  private httpMusic = inject(HttpMusic);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');

    console.log(this.selectedId);
    this.httpMusic.getMusicById(this.selectedId!).subscribe({
      next: (res) => {
        console.log(res.data);
        this.music$.next(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.selectedMusicId = this.activatedRoute.snapshot.paramMap.get('id');

    this.httpMusic.getMusicById(this.selectedMusicId || '').subscribe({
      next: (res) => {
        console.log('MÚSICA DETALLE RAW RESPONSE:', res);
        this.currentTrack.next(res?.data || res || null);
        console.log('MÚSICA DETALLE:', this.currentTrack.getValue());
      },
      error: (err) => {
        console.error('Error cargando detalle de música:', err);
      },
    });
  }

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

    // youtube.com/shorts/XXXX
    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    // youtube.com/live/XXXX
    const liveMatch = url.match(/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];

    // Si es solo el ID puro de 11 caracteres
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

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
    console.log('INTENTANDO REPRODUCIR TRACK:', track);
    console.log('YOUTUBE URL ORIGINAL:', track?.youtubeUrl);
    console.log('VIDEO ID EXTRAIDO:', this.extractVideoId(track?.youtubeUrl));
    console.log('EMBED URL GENERADA:', this.embedUrl);
  }

  /**
   * Pausa la reproducción (oculta el iframe)
   */
  togglePlay() {
    if (this.isPlaying) {
      this.isPlaying = false;
      this.embedUrl = null;
    } else if (this.currentTrack.getValue()) {
      this.isPlaying = true;
      this.embedUrl = this.getEmbedUrl(this.currentTrack.getValue());
      console.log('TOGGLE PLAY TRACK:', this.currentTrack.getValue());
      console.log('VIDEO ID EXTRAIDO:', this.extractVideoId(this.currentTrack.getValue()?.youtubeUrl));
      console.log('EMBED URL GENERADA:', this.embedUrl);
    }
  }

  /**
   * Track anterior
   */
  prevTrack() {
    if (this.musicList.length === 0) return;
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.musicList.length) % this.musicList.length;
    if (this.isPlaying) {
      this.embedUrl = this.getEmbedUrl(this.currentTrack.getValue());
    }
  }

  /**
   * Siguiente track
   */
  nextTrack() {
    if (this.musicList.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.musicList.length;
    if (this.isPlaying) {
      this.embedUrl = this.getEmbedUrl(this.currentTrack.getValue());
    }
  }
}
