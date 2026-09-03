import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpEvents } from '../../core/services/http-events';
import { HttpMusic } from '../../core/services/http-music';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpBar } from '../../core/services/http-bar';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home implements OnInit {
  eventList$ = new BehaviorSubject<any>([]);
  musicList$ = new BehaviorSubject<any[]>([]);
  barList$ = new BehaviorSubject<any>([]);
  eventFeaturedList$ = new BehaviorSubject<any>([]);

  private httpEvents = inject(HttpEvents);
  private httpMusic = inject(HttpMusic);
  private httpBar = inject(HttpBar);

  ngOnInit() {
    this.getEventsForInitialDate('initialDate', 4);
    this.getEventsForFeatured(1);
    this.getBarsForQuantity(6)
  }

  getEventsForInitialDate(field: string, quantity: number) {
    this.httpEvents.getEventsByField(field, quantity).subscribe({
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
        const musicItems = Array.isArray(res) ? res : res?.data || [];
        // Duplicar para efecto infinito
        this.musicList$.next(musicItems);
      },
      error: (err) => {
        console.error('Error cargando música:', err);
      },
    });

    // Carga bares desde la API
    this.httpBar.getBars().subscribe({
      next: (res) => {
        const barItems = Array.isArray(res) ? res : res?.data || [];
        // Duplicar para efecto infinito
        this.barList$.next(barItems);
      },
      error: (err) => {
        console.error('Error cargando bares:', err);
      },
    });
  }
  getEventsForFeatured(quantity: number) {
    this.httpEvents.getFeaturedEvents(quantity).subscribe({
      next: (res) => {
        console.log(res);
        this.eventFeaturedList$.next(res);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }

 getBarsForQuantity(quantity: number) {
        this.httpBar.getBarsByField(quantity).subscribe({
      next: (res) => {
        console.log(res);
        this.barList$.next(res);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
    }
}
