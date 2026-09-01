import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  auth = inject(HttpAuth);

  getDashboardRoute(role: string): string {
    if (role === 'ADMIN') return '/dashboard';
    if (role === 'BAR') return '/bar-dashboard';
    return '/user/profile'; // Regular users go to their profile editor
  }

  logout() {
    this.auth.logout();
  }
}
