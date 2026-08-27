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

  private httpEvents = inject(HttpEvents);

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
  }

  
}

