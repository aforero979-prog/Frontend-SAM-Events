import { Component, inject, OnInit } from '@angular/core';
import { HttpEvents } from '../../core/services/http-events';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [JsonPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  events: any = null;
  private httpEvent = inject(HttpEvents);

  ngOnInit() {
    this.httpEvent.getEvents().subscribe({
      next: (data: any) => {
        console.log(data);
        this.events = data;
      },
      error: (err: any) => { console.log(err); }
    });
  }
}