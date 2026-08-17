import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpEvents } from '../../core/services/http-events';
import { HttpAuth } from '../../core/services/http-auth';

@Component({
  selector: 'app-bar-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './bar-dashboard.html',
  styleUrl: './bar-dashboard.css',
})
export default class BarDashboard implements OnInit {
  private httpEvents = inject(HttpEvents);
  private httpAuth = inject(HttpAuth);

  eventCount = 0;
  userName = '';

  ngOnInit() {
    this.httpAuth.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email || 'Bar';
      }
    });

    this.httpEvents.getEvents().subscribe({
      next: (data: any) => this.eventCount = Array.isArray(data) ? data.length : 0,
      error: () => this.eventCount = 0,
    });
  }
}
