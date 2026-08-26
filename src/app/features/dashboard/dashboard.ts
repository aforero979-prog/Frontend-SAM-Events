import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpUser } from '../../core/services/http-user';
import { HttpEvents } from '../../core/services/http-events';
import { HttpBar } from '../../core/services/http-bar';
import { HttpPost } from '../../core/services/http-post';
import { HttpMusic } from '../../core/services/http-music';

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
  private httpPost = inject(HttpPost);
  private httpMusic = inject(HttpMusic);

  userCount = 0;
  eventCount = 0;
  barCount = 0;
  postCount = 0;
  musicCount = 0;

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
    this.httpPost.getPosts().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.postCount = list.length;
      },
      error: () => this.postCount = 0,
    });
    this.httpMusic.getMusic().subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.musicCount = list.length;
      },
      error: () => this.musicCount = 0,
    });
  }
}
