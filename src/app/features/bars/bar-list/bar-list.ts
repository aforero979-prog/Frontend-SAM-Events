import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpBar } from '../../../core/services/http-bar';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-bar-list',
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './bar-list.html',
  styleUrl: './bar-list.css',
})
export default class BarList {
  barList$ = new BehaviorSubject<any>([]);
  private httpBar = inject(HttpBar);

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';
  private router = inject( Router )

  ngOnInit() {
    this.loadBars();
  }

  loadBars() {
    this.httpBar.getBars().subscribe({
      next: (data: any) => {
        console.log('Bares cargados:', data);
  
        this.barList$.next( Array.isArray(data) ? data : [] );
      },
      error: (err) => console.error('Error cargando bares', err),
    });
  }

  onDelete(id: string) {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    if (!this.pendingDeleteId) return;
    this.httpBar.deleteBar(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadBars();
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => console.error('Error eliminando bar', err),
    });
    this.pendingDeleteId = '';
  }

  OnEdit(id: string) {
    console.log('Editar', id);
    this.router.navigateByUrl( `/dashboard/bar/edit/${id}` )
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }
}
