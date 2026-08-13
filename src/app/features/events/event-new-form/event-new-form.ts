import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { HttpCategory } from '../../../core/services/http-category';
import { HttpEvents } from '../../../core/services/http-events';
import { HttpBar } from '../../../core/services/http-bar';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-create',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export default class EventCreateComponent {
  formData!: FormGroup;

  categoryList$ = new BehaviorSubject<any[]>([]); // Observable para almacenar la lista de categorías
  barList$ = new BehaviorSubject<any[]>([]); // Observable para almacenar la lista de bares

  private router = inject(Router);
  private httpCategory = inject(HttpCategory);
  private httpEvents = inject(HttpEvents);
  private httpBar = inject(HttpBar);

  cities = ['Bogotá', 'Cali', 'Barranquilla', 'Medellín', 'Cartagena', 'Cúcuta', 'Neiva'];

  ngOnInit(): void {
    this.httpCategory.getCategories().subscribe({
      next: (response) => {
        console.log('Categorías obtenidas:', response);
        this.categoryList$.next(response.data || []);
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });

    this.httpBar.getBars().subscribe({
      next: (response) => {
        console.log('Bares obtenidos:', response);
        this.barList$.next(Array.isArray(response) ? response : response?.data || []);
      },
      error: (error) => {
        console.error('Error al obtener bares:', error);
      }
    });
  }

  constructor() {
    this.formData = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl('', [Validators.required]),

        // Grupo de localidades (General, VIP, BackStage, Palco)
        localidades: new FormGroup({
          general: new FormGroup({
            enabled: new FormControl(false),
            stock: new FormControl(0, [Validators.min(0)]),
            price: new FormControl(0, [Validators.min(0)])
          }),
          vip: new FormGroup({
            enabled: new FormControl(false),
            stock: new FormControl(0, [Validators.min(0)]),
            price: new FormControl(0, [Validators.min(0)])
          }),
          backstage: new FormGroup({
            enabled: new FormControl(false),
            stock: new FormControl(0, [Validators.min(0)]),
            price: new FormControl(0, [Validators.min(0)])
          }),
          palco: new FormGroup({
            enabled: new FormControl(false),
            stock: new FormControl(0, [Validators.min(0)]),
            price: new FormControl(0, [Validators.min(0)])
          })
        }),

        // Controles anidados para la fecha de inicio
        initialDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),

        // Controles anidados para la fecha final
        finalDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),

        category: new FormControl('', [Validators.required]),
        bar: new FormControl(''),
        imageUrl: new FormControl('', [Validators.required]),
        status: new FormControl(true)
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

    // Estructuramos el payload limpio con todas las propiedades capturadas del formulario
    const payload = {
      name: rawValues.name,
      description: rawValues.description,
      localidades: rawValues.localidades,
      initialDate: new Date(`${rawValues.initialDate.date}T${rawValues.initialDate.time}:00`).toISOString(),
      finalDate: new Date(`${rawValues.finalDate.date}T${rawValues.finalDate.time}:00`).toISOString(),
      category: rawValues.category,
      bar: rawValues.bar || null,
      imageUrl: rawValues.imageUrl,
      status: rawValues.status
    };

    console.log('DATOS COMPLETOS DEL FORMULARIO CAPTURADOS:', payload);
    this.httpEvents.createEvent(payload).subscribe({
      next: () => {
        //this.router.navigate(['/events']);
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);
      }
    });
  }
}