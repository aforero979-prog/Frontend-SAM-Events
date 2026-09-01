import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpEvents } from '../../../core/services/http-events';
import { HttpAuth } from '../../../core/services/http-auth';
import { HttpBar } from '../../../core/services/http-bar';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-bar-event-list',
  imports: [RouterLink, DatePipe, AsyncPipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export default class BarEventList implements OnInit {

  eventList$ = new BehaviorSubject<any>([]);
  private httpEvents = inject(HttpEvents);
  private httpAuth = inject(HttpAuth);
  private httpBar = inject(HttpBar);

  barId: string | null = null;
  events: any[] = [];

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';
  private router = inject(Router);

  ngOnInit() {
    const user = this.httpAuth.getCurrentUser();
    if (user?.barId) {
      this.barId = user.barId;
      this.loadEvents();
    } else if (user?._id) {
      // Buscar el bar vinculado al usuario
      this.httpBar.getBarByUserId(user._id).subscribe({
        next: (res: any) => {
          const bar = res?.data ?? res;
          if (bar?._id) {
            this.barId = bar._id;
            this.loadEvents();
          }
        },
        error: () => {}
      });
    }
  }

  loadEvents() {
    if (!this.barId) return;
    this.httpEvents.getEventsByBarId(this.barId).subscribe({
      next: (data: any) => {
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.events = list;
        this.eventList$.next(list);
      },
      error: (err) => console.error('Error cargando eventos del bar', err),
    });
  }

  onDelete(id: string) {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    if (!this.pendingDeleteId) return;
    this.httpEvents.deleteEvent(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadEvents();
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => console.error('Error eliminando evento', err),
    });
    this.pendingDeleteId = '';
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }

  onEdit(id: string) {
    console.log('Editar', id);
  }
}
