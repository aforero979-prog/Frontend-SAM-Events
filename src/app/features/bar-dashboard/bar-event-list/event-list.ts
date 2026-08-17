import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpEvents } from '../../../core/services/http-events';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-admin-event-list',
  imports: [RouterLink, DatePipe, AsyncPipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export default class AdminEventList implements OnInit {

  eventList$ = new BehaviorSubject<any>([])
  private httpEvents = inject(HttpEvents);

  events: any[] = [];

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';
  private router = inject( Router )

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.httpEvents.getEvents().subscribe({
      next: (data: any) => {
        console.log('Eventos recibidos:', data);
        const list = Array.isArray(data) ? data : (data?.data || []);
        this.events = list;
        this.eventList$.next(list);
      },
      error: (err) => console.error('Error cargando eventos', err),
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
    console.log('Editar', id)
    this.router.navigateByUrl( '/dashboard/event/edit')
  }
}
