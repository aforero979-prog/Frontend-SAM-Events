import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpMusic } from '../../../core/services/http-music';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-music-home',
  imports: [RouterLink, AsyncPipe],
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
}
