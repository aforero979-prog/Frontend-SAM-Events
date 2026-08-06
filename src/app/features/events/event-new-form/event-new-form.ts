import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { HttpCategory } from '../../../core/services/http-category';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export default class EventCreateComponent {
  formData!: FormGroup;

  categoryList$ = new BehaviorSubject<any[]>([]); // Observable para almacenar la lista de categorías

  private router = inject(Router);
  private httpCategory = inject(HttpCategory);
  // private eventService = inject(EventService);

  ngOnInit(): void {
    this.httpCategory.getCategories().subscribe({
      next: (categories) => {
        console.log('Categorías obtenidas:', categories);
        this.categoryList$.next(categories);
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  constructor() {

    this.formData = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl(''),
        price: new FormControl(0, [Validators.required, Validators.min(0)]),
        stock: new FormControl(1, [Validators.required, Validators.min(1)]),
        status: new FormControl(true),
        
        // Controles anidados para la fecha de inicio (Homologado con Mongoose)
        initialDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),
        
        // Controles anidados para la fecha final (Homologado con Mongoose)
        finalDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),
        
        imageUrl: new FormControl(''),
        category: new FormControl('', [Validators.required])
      },
      { 
        validators: [this.dateRangeValidator] 
      }
    );
  }

  private dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const init = group.get('initialDate')?.value;
    const final = group.get('finalDate')?.value;

    if (init?.date && init?.time && final?.date && final?.time) {
      const start = new Date(`${init.date}T${init.time}:00`);
      const end = new Date(`${final.date}T${final.time}:00`);
      
      if (end < start) {
        return { dateRangeInvalid: true };
      }
    }
    return null;
  };

  onSubmit(): void {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    const rawValues = this.formData.value;
    const payload = {
      ...rawValues,
      initialDate: new Date(`${rawValues.initialDate.date}T${rawValues.initialDate.time}:00`).toISOString(),
      finalDate: new Date(`${rawValues.finalDate.date}T${rawValues.finalDate.time}:00`).toISOString()
    };

    console.log('Enviando POST para CREAR:', payload);
    // this.eventService.createEvent(payload).subscribe(() => this.router.navigate(['/events']));
  }
}