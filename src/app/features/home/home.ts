import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
export default class Home implements OnInit, OnDestroy {
  eventList$ = new BehaviorSubject<any[]>([]);
  musicList$ = new BehaviorSubject<any[]>([]);
  barList$ = new BehaviorSubject<any[]>([]);
  eventFeaturedList$ = new BehaviorSubject<any[]>([]);

  currentSlide = 0;
  private autoSlideTimer: any = null;

  private httpEvents = inject(HttpEvents);
  private httpMusic = inject(HttpMusic);
  private httpBar = inject(HttpBar);

  ngOnInit() {
    this.getEventsForInitialDate('initialDate', 4);
    this.getEventsForFeatured(5);
    this.loadMusicData();
    this.getBarsForQuantity(4);
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  getEventsForInitialDate(field: string, quantity: number) {
    this.httpEvents.getEventsByField(field, quantity).subscribe({
      next: (res) => {
        const events = Array.isArray(res) ? res : res?.data || res?.events || [];
        this.eventList$.next(events);
      },
      error: (err) => console.error('Error cargando eventos:', err),
    });
  }

  /**
   * Carga los eventos destacados e inicia el carrusel automático
   */
  getEventsForFeatured(quantity: number) {
    this.httpEvents.getFeaturedEvents(quantity).subscribe({
      next: (res) => {
        const events = Array.isArray(res) ? res : res?.data || res?.events || [];
        this.eventFeaturedList$.next(events);
        
        if (events.length > 0) {
          this.startAutoSlide();
        }
      },
      error: (err) => console.error('Error cargando destacados:', err),
    });
  }

  /**
   * Carga la música y duplica la lista para efecto infinito continuo
   */
  loadMusicData() {
    this.httpMusic.getMusic().subscribe({
      next: (res) => {
        const musicItems = Array.isArray(res) ? res : res?.data || [];
        // Se duplica la lista para dar el efecto de ciclo infinito sin huecos en CSS
        const infiniteList = musicItems.length > 0 ? [...musicItems, ...musicItems] : [];
        this.musicList$.next(infiniteList);
      },
      error: (err) => console.error('Error cargando música:', err),
    });
  }

  getBarsForQuantity(quantity: number) {
    this.httpBar.getBarsByField(quantity).subscribe({
      next: (res) => {
        const bars = Array.isArray(res) ? res : res?.data || [];
        this.barList$.next(bars);
      },
      error: (err) => console.error('Error cargando bares:', err),
    });
  }

  // ── CARRUSEL DESTACADOS ───────────────────────────

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.nextSlide();
    }, 8000); // Cambia automáticamente cada 8 segundos
  }

  stopAutoSlide() {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
    }
  }

  prevSlide() {
    const events = this.eventFeaturedList$.value;
    if (!events.length) return;
    this.currentSlide = (this.currentSlide - 1 + events.length) % events.length;
    this.startAutoSlide();
  }

  nextSlide() {
    const events = this.eventFeaturedList$.value;
    if (!events.length) return;
    this.currentSlide = (this.currentSlide + 1) % events.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.startAutoSlide();
  }

  handleImageError(event: any) {
    event.target.src = '/assets/default-event.jpg';
  }

  handleBarImageError(event: any) {
    event.target.src = '/assets/default-bar.jpg';
  }
}