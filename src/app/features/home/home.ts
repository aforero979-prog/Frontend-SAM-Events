import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpEvents } from '../../core/services/http-events';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export default class Home {
  eventList$ = new BehaviorSubject<any>([]);
  eventFeaturedList$ = new BehaviorSubject<any>([]);

  private httpEvents = inject(HttpEvents);

  ngOnInit() {
    this.getEventsForInitialDate('initialDate', 3);
    this.getEventsForFeatured(1);
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
}
