import { Component, inject } from '@angular/core';
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

export default class MusicHome {

      musicList$ = new BehaviorSubject<any>([])
  
      private httpMusic = inject( HttpMusic )
      private router = inject( Router )
  
      ngOnInit() {
          this.httpMusic.getMusic().subscribe({
              next: ( res ) => {
                  console.log( res )
  
                  this.musicList$.next( res )
              },
              error: ( err ) => {
                  console.error( err )
              },
              complete: () => {}
          })
      }


// 1. Agrega esta nueva variable al inicio de tu clase
videoUrlActiva: string | null = null;

// 2. Actualiza la función activarVideo
activarVideo(event: Event, music: any) {
  event.preventDefault();
  event.stopPropagation(); 

  let url = music.youtubeUrl;
  if (!url) return;

  // Defensa contra etiquetas HTML (la que ya teníamos)
  if (url.includes('<iframe')) {
    const match = url.match(/src="([^"]+)"/);
    if (match && match[1]) {
      url = match[1]; 
    }
  }

  // Transformación a embed y autoplay
  if (url.includes('watch?v=')) {
    const videoId = url.split('v=')[1].split('&')[0];
    url = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } 
  else if (url.includes('embed/') && !url.includes('autoplay=1')) {
    const separador = url.includes('?') ? '&' : '?';
    url = `${url}${separador}autoplay=1`;
  }

  // 3. En lugar de modificar "music", asignamos la URL a la variable global del componente
  this.videoUrlActiva = url;
}

// 4. Nueva función para cerrar el modal
cerrarModal() {
  this.videoUrlActiva = null;
}
}
