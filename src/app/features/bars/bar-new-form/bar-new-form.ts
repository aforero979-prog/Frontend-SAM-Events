
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { HttpBar } from '../../../core/services/http-bar';
import { HttpApiColombia } from '../../../core/services/http-api-colombia';

@Component({
  selector: 'app-bar-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './bar-new-form.html',
  styleUrl: './bar-new-form.css',
})
export default class BarNewForm implements OnInit {
  private httpBar = inject(HttpBar);
  private httpColombia = inject(HttpApiColombia);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef); // Para limpiar suscripciones al destruir el componente

  departments$ = new BehaviorSubject<any[]>([]);
  cities$ = new BehaviorSubject<any[]>([]);
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
      department: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      urlPage: new FormControl(''),
      capacity: new FormControl(0, [Validators.min(0)]),
      contactPhone: new FormControl(''),
      isActive: new FormControl(true),
    });
  }

  ngOnInit() {
    // 1. Carga inicial de departamentos
    this.httpColombia.getDepartments().subscribe({
      next: (deps) => {
        console.log('Departamentos obtenidos:', deps);
        this.departments$.next(deps || []);
      },
      error: (err) => console.error('Error al obtener departamentos:', err),
    });

    // 2. Escuchar cambios de departamento usando switchMap (Cancela peticiones previas si cambia rápido)
    this.formData.get('department')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(() => this.formData.get('city')?.setValue('')), // Resetea la ciudad al cambiar departamento
      switchMap((depValue) => {
        if (!depValue) return of([]);

        const deps = this.departments$.getValue();
        const foundDep = deps.find((d) => d.name === depValue || d.id === depValue);

        if (foundDep?.id) {
          return this.httpColombia.getCitiesByDepartment(foundDep.id).pipe(
            catchError((err) => {
              console.error('Error al obtener ciudades:', err);
              return of([]);
            })
          );
        }
        return of([]);
      })
    ).subscribe((cities) => {
      console.log('Ciudades obtenidas:', cities);
      this.cities$.next(cities || []);
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);
      this.httpBar.createBar(this.formData.value).subscribe({
        next: (data) => {
          console.log('Bar creado:', data);
          this.formData.reset();
          this.router.navigateByUrl('/dashboard/bars');
        },
        error: (err) => console.error('Error creando bar:', err),
      });
    } else {
      this.formData.markAllAsTouched(); // Marca todos los campos para mostrar errores si el form es inválido
      console.log('El formulario no es válido');
    }
  }

  get name() {
    return this.formData.get('name');
  }
}