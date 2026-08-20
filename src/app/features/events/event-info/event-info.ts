import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpEvents } from '../../../core/services/http-events';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-info',
  imports: [ AsyncPipe, RouterLink],
  templateUrl: './event-info.html',
  styleUrl: './event-info.css',
})
export default class EventInfo {
  event$ = new BehaviorSubject<any>({});
  selectedId!: string | null;

  private httpEvents = inject(HttpEvents);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');

    console.log( this.selectedId );  
    this.httpEvents.getEventById(this.selectedId).subscribe({
        next: (res) => {
            console.log(res.data);
            this.event$.next(res.data);
        },
        error: (err) => {
            console.error(err);
        },
    });
}


}
