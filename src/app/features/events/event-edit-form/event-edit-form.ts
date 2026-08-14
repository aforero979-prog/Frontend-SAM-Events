import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpEvents } from '../../../core/services/http-events';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { HttpBar } from '../../../core/services/http-bar';

@Component({
  selector: 'app-event-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './event-edit-form.html',
  styleUrl: './event-edit-form.css',
})
export default class EventEditForm {
  selectedId!: string | null;
  formData!: FormGroup;
  private activatedRoute = inject(ActivatedRoute);
  private httpEvent = inject(HttpEvents);
  private router = inject(Router);
  private httpBar = inject(HttpBar);

  cities = ['Bogotá', 'Cali', 'Barranquilla', 'Medellín', 'Cartagena', 'Cúcuta', 'Neiva'];


  barList$ = new BehaviorSubject<any[]>([]);

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      localidades: new FormGroup({
        General: new FormControl(0, [Validators.min(0)]),
        VIP: new FormControl(0, [Validators.min(0)]),
        BackStage: new FormControl(0, [Validators.min(0)]),
      }),
      initialDate: new FormControl('', [Validators.required]),
      finalDate: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
      status: new FormControl('active', [Validators.required]),
    });
  }
  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');

    this.httpEvent.getEventById(this.selectedId).subscribe({
      next: (data) => {
        console.log(data.data);
        const { name, description, localidades, initialDate, finalDate, city, imageUrl, status } = data.data;
        this.formData.patchValue({
          name: name,
          description: description,
          localidades: localidades,
          initialDate: initialDate,
          finalDate: finalDate,
          city: city,
          imageUrl: imageUrl,
          status: status,
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Evento encontrado por ID con exito');
      },
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

  onSubmit() {
    if (this.formData.valid) {
      this.httpEvent.updateEvent(this.selectedId, this.formData.value).subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('Evento actualizado con exito');
        }

      })
    } else {
      console.error('Formulario inválido');
    }
  }

  get name() {
    return this.formData.get('name');
  }
}
