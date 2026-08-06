
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { HttpEvents } from '../../../core/services/http-events';
import { HttpCategory } from '../../../core/services/http-category';
import { HttpRoles } from '../../../core/services/http-roles';

@Component({
  selector: 'app-event-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export default class EventNewForm {
  private httpEvents   = inject(HttpEvents);
  private httpCategory = inject(HttpCategory);
  private httpRoles = inject(HttpRoles);

  categories$ = new BehaviorSubject<any[]>([]);
  roleList$ = new BehaviorSubject ([]); //RxJs: Observable que mantiene en memoria los datos de la API, para que puedan ser usados en el HTML.



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
        this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.roleList$.next(roles);
      },

      error: (err) => {
        console.log(err);
      },

      complete: () => {
        console.log("Complete siempre se ejecuta ");
      }
    });

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

