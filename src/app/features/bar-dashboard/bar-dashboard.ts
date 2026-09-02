import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpEvents } from '../../core/services/http-events';
import { HttpBar } from '../../core/services/http-bar';
import { HttpAuth } from '../../core/services/http-auth';

@Component({
  selector: 'app-bar-dashboard',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './bar-dashboard.html',
  styleUrl: './bar-dashboard.css',
})
export default class BarDashboard implements OnInit {
  private httpEvents = inject(HttpEvents);
  private httpBar = inject(HttpBar);
  private httpAuth = inject(HttpAuth);

  eventCount = 0;
  userName = '';
  barName = '';
  barComplete = false;
  private barId: string | null = null;

  ngOnInit() {
    this.httpAuth.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.name || user.email || 'Bar';

        // Caso 1: el usuario tiene barId explícito
        if (user.barId) {
          this.barId = user.barId;
          this.loadBarData(user.barId);
          this.loadBarEventCount(user.barId);
        }
        // Caso 2: buscar el bar por userId (si ya lo creó antes)
        else if (user._id) {
          this.httpBar.getBarByUserId(user._id).subscribe({
            next: (res: any) => {
              const bar = res?.data ?? res;
              this.barName = bar?.name || '';
              this.barComplete = !!(bar?.name && bar?.city && bar?.address && bar?.description);
              if (bar?._id) {
                this.barId = bar._id;
                this.loadBarEventCount(bar._id);
              }
            },
            error: () => {}
          });
        }
      }
    });
  }

  loadBarData(barId: string) {
    this.httpBar.getBarById(barId).subscribe({
      next: (res: any) => {
        const bar = res?.data ?? res;
        this.barName = bar?.name || '';
        this.barComplete = !!(bar?.name && bar?.city && bar?.address && bar?.description);
      },
      error: () => {}
    });
  }

  loadBarEventCount(barId: string) {
    this.httpEvents.getEventsByBarId(barId).subscribe({
      next: (data: any) => this.eventCount = Array.isArray(data) ? data.length : 0,
      error: () => this.eventCount = 0,
    });
  }

  logout() {
    this.httpAuth.logout();
  }
}

