import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpEvents } from '../../core/services/http-events';
import { HttpMusic } from '../../core/services/http-music';
import { HttpBar } from '../../core/services/http-bar';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe, DatePipe, SlicePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export default class Home implements OnInit {
  eventList$ = new BehaviorSubject<any>([]);
  musicList$ = new BehaviorSubject<any[]>([]);
  eventFeaturedList$ = new BehaviorSubject<any>([]);
  barList$ = new BehaviorSubject<any[]>([]);

  currentSlide = 0;

  private httpEvents = inject(HttpEvents);
  private httpMusic = inject(HttpMusic);
  private httpBar = inject(HttpBar);

  ngOnInit() {
    this.getEventsForInitialDate('initialDate', 3);
    this.getEventsForFeatured(3);
    this.loadBars();
  }

  getEventsForInitialDate(field: string, quantity: number) {
    this.httpEvents.getEventsByField(field, quantity).subscribe({
      next: (res) => {
        this.eventList$.next(res);
      },
      error: (err) => {
        console.error(err);
      },
    });

    // Cargar música desde la API
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        const musicItems = Array.isArray(res) ? res : (res?.data || []);
        this.musicList$.next(musicItems);
      },
      error: (err) => {
        console.error('Error cargando música:', err);
      }
    });
  }

  getEventsForFeatured(quantity: number) {
    this.httpEvents.getFeaturedEvents(quantity).subscribe({
      next: (res) => {
        this.eventFeaturedList$.next(res);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadBars() {
    this.httpBar.getBars().subscribe({
      next: (res) => {
        this.barList$.next(res);
      },
      error: (err) => {
        console.error('Error cargando bares:', err);
      }
    });
  }

  prevSlide() {
    const events = this.eventFeaturedList$.value;
    this.currentSlide = (this.currentSlide - 1 + events.length) % events.length;
  }

  nextSlide() {
    const events = this.eventFeaturedList$.value;
    this.currentSlide = (this.currentSlide + 1) % events.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  handleImageError(event: any) {
    event.target.src = '/assets/default-event.jpg';
  }
}
