import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { HttpCategory } from '../../../core/services/http-category';
import { HttpEvents } from '../../../core/services/http-events';
import { HttpBar } from '../../../core/services/http-bar';
import { HttpAuth } from '../../../core/services/http-auth';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-bar-event-create',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './bar-event-new-form.html',
  styleUrl: './bar-event-new-form.css',
})
export default class BarEventCreateComponent {
  formData!: FormGroup;
  serverErrorMessage: string = '';

  barId: string | null = null;
  barData: any = null;

  categoryList$ = new BehaviorSubject<any[]>([]);

  private router = inject(Router);
  private httpCategory = inject(HttpCategory);
  private httpEvents = inject(HttpEvents);
  private httpBar = inject(HttpBar);
  private httpAuth = inject(HttpAuth);

  ngOnInit(): void {
    window.scrollTo(0, 0);

    // Cargar categorías
    this.httpCategory.getCategories().subscribe({
      next: (response) => {
        this.categoryList$.next(response.data || []);
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });

    // Obtener el barId del usuario logueado
    const user = this.httpAuth.getCurrentUser();
    if (user?.barId) {
      this.barId = user.barId;
      this.loadBarData(user.barId);
    } else if (user?._id) {
      this.httpBar.getBarByUserId(user._id).subscribe({
        next: (res: any) => {
          const bar = res?.data ?? res;
          if (bar?._id) {
            this.barId = bar._id;
            this.loadBarData(bar._id);
          }
        },
        error: () => {}
      });
    }
  }

  loadBarData(barId: string) {
    this.httpBar.getBarById(barId).subscribe({
      next: (res: any) => {
        this.barData = res?.data ?? res;
      },
      error: () => {}
    });
  }

  constructor() {
    this.formData = new FormGroup(
      {
        name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
        description: new FormControl('', [Validators.required]),

        // Localidades
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

        // Fechas
        initialDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),

        direccion: new FormControl('', [Validators.required, Validators.maxLength(50)]),

        finalDate: new FormGroup({
          date: new FormControl('', [Validators.required]),
          time: new FormControl('', [Validators.required])
        }),

        category: new FormControl('General'),
        imageUrl: new FormControl('', [Validators.required]),
        status: new FormControl(true)
      },
      {
        validators: [this.dateRangeValidator, this.barCapacityValidator]
      }
    );
  }

  private barCapacityValidator = (group: AbstractControl): ValidationErrors | null => {
    if (!this.barData || this.barData.capacity === undefined || this.barData.capacity === null) return null;

    const localidades = group.get('localidades')?.value || {};
    const general = Number(localidades.general?.stock) || 0;
    const vip = Number(localidades.vip?.stock) || 0;
    const backstage = Number(localidades.backstage?.stock) || 0;
    const palco = Number(localidades.palco?.stock) || 0;

    const totalStock = general + vip + backstage + palco;
    if (totalStock > this.barData.capacity) {
      return {
        capacityExceeded: {
          totalStock,
          capacity: this.barData.capacity
        }
      };
    }
    return null;
  };

  private dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const init = group.get('initialDate')?.value;
    const final = group.get('finalDate')?.value;

    if (!init?.date || !init?.time || !final?.date || !final?.time) {
      return null;
    }

    const startDate = new Date(`${init.date}T${init.time}:00`);
    const endDate = new Date(`${final.date}T${final.time}:00`);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { invalidDateFormat: true };
    }

    if (endDate <= startDate) {
      return { endDateBeforeStartDate: true };
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    const MIN_DURATION_MINUTES = 40;

    if (diffInMinutes < MIN_DURATION_MINUTES) {
      return {
        minDurationInvalid: {
          currentMinutes: Math.round(diffInMinutes),
          minRequiredMinutes: MIN_DURATION_MINUTES
        }
      };
    }

    return null;
  };

  onSubmit(): void {
    this.serverErrorMessage = '';

    if (!this.barId) {
      this.serverErrorMessage = 'Debes completar los datos de tu bar en "MI BAR" antes de poder crear un evento.';
      window.scrollTo(0, 0);
      return;
    }

    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      this.serverErrorMessage = 'Por favor, completa todos los campos requeridos correctamente.';
      
      // Depuración profunda para ver exactamente qué control falló
      const invalidFields: string[] = [];
      Object.keys(this.formData.controls).forEach(key => {
        const control = this.formData.get(key);
        if (control?.invalid) invalidFields.push(key);
      });
      console.error('El formulario es INVÁLIDO. Campos con error:', invalidFields);
      console.error('Errores globales del formulario:', this.formData.errors);

      alert('No se pudo guardar: Revisa que todos los campos obligatorios estén llenos y las fechas sean correctas.');
      
      window.scrollTo(0, 0);
      return;
    }

    const rawValues = this.formData.value;
    
    // Calcular capacidad total sumando el stock de todas las localidades
    const localidades = rawValues.localidades || {};
    let totalCapacity = (Number(localidades.general?.stock) || 0) +
                        (Number(localidades.vip?.stock) || 0) +
                        (Number(localidades.backstage?.stock) || 0) +
                        (Number(localidades.palco?.stock) || 0);

    // Mongoose a veces rechaza el valor 0 en campos requeridos si usan validadores estrictos.
    // Garantizamos que si no pusieron aforo, se mande al menos 1 por seguridad, o el aforo original del bar.
    if (totalCapacity === 0) {
      totalCapacity = this.barData?.capacity || 1;
    }

    const payload = {
      name: rawValues.name,
      description: rawValues.description,
      capacity: totalCapacity, // Requerido por el backend
      localidades: rawValues.localidades,
      direccion: rawValues.direccion,
      initialDate: new Date(`${rawValues.initialDate.date}T${rawValues.initialDate.time}:00`).toISOString(),
      finalDate: new Date(`${rawValues.finalDate.date}T${rawValues.finalDate.time}:00`).toISOString(),
      category: rawValues.category,
      bar: this.barId, // Auto-asigna el bar del usuario logueado
      imageUrl: rawValues.imageUrl,
      status: rawValues.status
    };

    console.log('EVENTO CREADO PARA BAR:', payload);
    this.httpEvents.createEvent(payload).subscribe({
      next: () => {
        this.router.navigate(['/bar-dashboard/events']);
      },
      error: (error) => {
        console.error('Error al crear el evento:', error);
        this.serverErrorMessage = error.error?.msj || error.message || 'Error al crear el evento';
        alert('ERROR DEL SERVIDOR: ' + this.serverErrorMessage);
      }
    });
  }
}
