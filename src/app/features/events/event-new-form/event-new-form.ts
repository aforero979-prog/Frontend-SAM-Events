import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpEvents } from '../../../core/services/http-events';
import { HttpCategory } from '../../../core/services/http-category';

@Component({
  selector: 'app-event-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export class EventNewForm implements OnInit {
  private httpEvents   = inject(HttpEvents);
  private httpCategory = inject(HttpCategory);

  categories$ = new BehaviorSubject<any[]>([]);

  formData: FormGroup; 
  successMsg = '';
  errorMsg = '';

  constructor() {
    this.formData = new FormGroup({
      name:        new FormControl('', [Validators.required]),
      description: new FormControl(''),
      price:       new FormControl(0, [Validators.required, Validators.min(0)]),
      stock:       new FormControl(1, [Validators.required, Validators.min(1)]),
      initialDate: new FormControl('', [Validators.required]),
      finalDate:   new FormControl('', [Validators.required]),
      imageUrl:    new FormControl(''),
      category:    new FormControl('', [Validators.required]),  // ObjectId de categoría
    });
  }

  ngOnInit() {
    // Cargar categorías para el select
    this.httpCategory.getCategories().subscribe({
      next: (res: any) => {
        const cats = res?.data || res || [];
        this.categories$.next(cats);
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpEvents.createEvent(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
          this.successMsg = 'Evento creado correctamente';
          this.errorMsg = '';
          this.formData.reset({ price: 0, stock: 1 });
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error?.msg || 'Error al crear el evento';
          this.successMsg = '';
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}