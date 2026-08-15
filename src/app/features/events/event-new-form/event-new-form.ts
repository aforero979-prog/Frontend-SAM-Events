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
  serverErrorMessage: string = '';
  bars: any[] = [];

  categoryList$ = new BehaviorSubject<any[]>([]); // Observable para almacenar la lista de categorías
  barList$ = new BehaviorSubject<any[]>([]); // Observable para almacenar la lista de bares

  private router = inject(Router);
  private httpCategory = inject(HttpCategory);
  private httpEvents = inject(HttpEvents);
  private httpBar = inject(HttpBar);

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
        const list = Array.isArray(response) ? response : response?.data || [];
        this.bars = list;
        this.barList$.next(list);
        this.formData.updateValueAndValidity();
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

        category: new FormControl('General'),
        bar: new FormControl(''),
        imageUrl: new FormControl('', [Validators.required]),
        status: new FormControl(true)
      },
      {
        validators: [this.dateRangeValidator, this.barCapacityValidator]
      }
    );
  }

  private barCapacityValidator = (group: AbstractControl): ValidationErrors | null => {
    const barId = group.get('bar')?.value;
    if (!barId) return null;

    const selectedBar = this.bars.find(b => (b._id || b.id) === barId);
    if (!selectedBar || selectedBar.capacity === undefined || selectedBar.capacity === null) return null;

    const localidades = group.get('localidades')?.value || {};
    const general = Number(localidades.general?.stock) || 0;
    const vip = Number(localidades.vip?.stock) || 0;
    const backstage = Number(localidades.backstage?.stock) || 0;
    const palco = Number(localidades.palco?.stock) || 0;

    const totalStock = general + vip + backstage + palco;
    if (totalStock > selectedBar.capacity) {
      return {
        capacityExceeded: {
          totalStock,
          capacity: selectedBar.capacity
        }
      };
    }
    return null;
  };

  /**
   * Validador personalizado para el rango de fechas y horas del evento.
   * Valida:
   * 1. Que la fecha/hora de finalización no sea anterior o igual a la de inicio.
   * 2. Que la duración total del evento sea de al menos 40 minutos.
   * Funciona dinámicamente tanto si el evento es el mismo día como si abarca días diferentes.
   */
  private dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const init = group.get('initialDate')?.value;
    const final = group.get('finalDate')?.value;

    // Si falta alguno de los valores requeridos de fecha u hora, omitimos la validación de rango (Validators.required se encarga)
    if (!init?.date || !init?.time || !final?.date || !final?.time) {
      return null;
    }

    // Construir los objetos Date a partir de la fecha (AAAA-MM-DD) y la hora (HH:mm)
    const startDate = new Date(`${init.date}T${init.time}:00`);
    const endDate = new Date(`${final.date}T${final.time}:00`);

    // Comprobación de seguridad: verificar que las fechas sean instancias válidas de Date
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { invalidDateFormat: true };
    }

    // Caso 1: La fecha y hora final es estrictamente anterior o igual a la fecha y hora inicial
    if (endDate <= startDate) {
      return { endDateBeforeStartDate: true };
    }

    // Caso 2: Calcular la diferencia real en minutos (1 minuto = 60,000 ms)
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    const MIN_DURATION_MINUTES = 40;

    // Si la duración calculada es inferior a 40 minutos, devolver error con los datos de tiempo
    if (diffInMinutes < MIN_DURATION_MINUTES) {
      return {
        minDurationInvalid: {
          currentMinutes: Math.round(diffInMinutes),
          minRequiredMinutes: MIN_DURATION_MINUTES
        }
      };
    }

    // Si cumple todas las restricciones de tiempo y duración, el rango es coherente y válido
    return null;
  };

  get selectedBar() {
    const barId = this.formData.get('bar')?.value;
    if (!barId) return null;
    return this.bars.find(b => (b._id || b.id) === barId) || null;
  }

  onSubmit(): void {
    this.serverErrorMessage = '';
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
        this.router.navigate(['/dashboard/events']);
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);
        this.serverErrorMessage = error.error?.msj || error.message || 'Error al crear el evento';
      }
    });
  }
}