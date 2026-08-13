import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpUser } from '../../core/services/http-user';
import { HttpEvents } from '../../core/services/http-events';
import { HttpBar } from '../../core/services/http-bar';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export default class Dashboard implements OnInit {
  private httpUser = inject(HttpUser);
  private httpEvents = inject(HttpEvents);
  private httpBar = inject(HttpBar);

  userCount = 0;
  eventCount = 0;
  barCount = 0;

  ngOnInit() {
    this.httpUser.getUsers().subscribe({
      next: (data: any) => this.userCount = Array.isArray(data) ? data.length : 0,
      error: () => this.userCount = 0,
    });
    this.httpEvents.getEvents().subscribe({
      next: (data: any) => this.eventCount = Array.isArray(data) ? data.length : 0,
      error: () => this.eventCount = 0,
    });
    this.httpBar.getBars().subscribe({
      next: (data: any) => this.barCount = Array.isArray(data) ? data.length : 0,
      error: () => this.barCount = 0,
    });
  }
}
