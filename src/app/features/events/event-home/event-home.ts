import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { BehaviorSubject } from 'rxjs';
import { HttpEvents } from '../../../core/services/http-events';

@Component({
  selector: 'app-event-home',
  imports: [RouterLink, DatePipe, AsyncPipe],
  templateUrl: './event-home.html',
  styleUrl: './event-home.css',
})
export default class EventHome {

  eventList$ = new BehaviorSubject<any>([]);

  private httpEvents = inject(HttpEvents);
  private router = inject( Router )

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';
  

  ngOnInit() {
    this.loadEvents();
  }


  loadEvents() {
    this.httpEvents.getEvents().subscribe({
      next: ( data: any ) => {
        console.log( 'Eventos cargados:', data )
        
        const list = Array.isArray( data ) ? data : ( data?.data || [])
        this.eventList$.next( list )
      },
      error: ( err ) => {
        console.error('Error cargando eventos', err )
      },
      complete: () => {}
    }) 
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

    OnEdit(id: string) {
    console.log('Editar', id);
    this.router.navigateByUrl( `/dashboard/event/edit/${id}` )
  }
  
  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }

}
