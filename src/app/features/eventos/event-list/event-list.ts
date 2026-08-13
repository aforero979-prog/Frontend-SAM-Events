import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpEvents } from '../../../core/services/http-events';

@Component({
  selector: 'app-admin-event-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css',
})
export default class AdminEventList implements OnInit {
  private httpEvents = inject(HttpEvents);
  events: any[] = [];

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.httpEvents.getEvents().subscribe({
      next: (data: any) => {
        console.log('Eventos recibidos:', data);
        this.events = Array.isArray(data) ? data : (data?.data || []);
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
}
