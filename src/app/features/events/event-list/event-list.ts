import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
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
  private router = inject( Router )

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

  // onEdit( id: string ) {
  //   console.log('Eliminar', id)
  //   this.httpEvents.createEvent
  // }
}
