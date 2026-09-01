import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpEvents } from '../../core/services/http-events';
import { HttpMusic } from '../../core/services/http-music';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export default class Home implements OnInit {
  eventList$ = new BehaviorSubject<any>([]);
  musicList$ = new BehaviorSubject<any[]>([]);

  private httpEvents = inject(HttpEvents);
  private httpMusic = inject(HttpMusic);

  ngOnInit() {
    this.httpEvents.getEvents().subscribe({
      next: (res) => {
        console.log(res);
        this.eventList$.next(res);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });

    // Cargar música desde la API
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        const musicItems = Array.isArray(res) ? res : (res?.data || []);
        // Duplicar para efecto infinito
        this.musicList$.next(musicItems);
      },
      error: (err) => {
        console.error('Error cargando música:', err);
      }
    });
  }
}
