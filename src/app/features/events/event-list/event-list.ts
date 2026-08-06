import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { HttpEvents } from '../../../core/services/http-events';

@Component({
  selector: 'app-event-list',
  imports: [RouterLink, DatePipe, AsyncPipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export default class EventList {

  eventList$ = new BehaviorSubject<any>([]);

  private httpEvents = inject(HttpEvents);

  ngOnInit() {
    this.httpEvents.getEvents().subscribe({
      next: ( res ) => {
        console.log( res )
        this.eventList$.next( res )
      },
      error: ( err ) => {
        console.error( err )
      },
      complete: () => {}
    })
  }
}
