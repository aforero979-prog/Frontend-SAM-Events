import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpBar } from '../../../core/services/http-bar';
import { HttpAuth } from '../../../core/services/http-auth';
import { HttpApiColombia } from '../../../core/services/http-api-colombia';

@Component({
  selector: 'app-bar-profile',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './bar-profile.html',
  styleUrl: './bar-profile.css',
})
export default class BarProfile implements OnInit {
  private httpBar = inject(HttpBar);
  private httpAuth = inject(HttpAuth);
  private httpColombia = inject(HttpApiColombia);
  private router = inject(Router);

  departments$ = new BehaviorSubject<any[]>([]);
  cities$ = new BehaviorSubject<any[]>([]);
  formData: FormGroup;
  barId: string | null = null;
  successMsg = '';
  errorMsg = '';
  isLoading = true;

  constructor() {
    this.formData = new FormGroup({
      name:         new FormControl('', [Validators.required]),
      description:  new FormControl('', [Validators.required]),
      imageUrl:     new FormControl('', [Validators.required]),
      department:   new FormControl(''),
      city:         new FormControl('', [Validators.required]),
      address:      new FormControl('', [Validators.required]),
      urlPage:      new FormControl(''),
      capacity:     new FormControl(0, [Validators.min(0)]),
      contactPhone: new FormControl(''),
      isActive:     new FormControl(true),
    });
  }

  ngOnInit() {
    const user = this.httpAuth.getCurrentUser();

    // Cargar departamentos
    this.httpColombia.getDepartments().subscribe({
      next: (deps) => this.departments$.next(deps || []),
      error: (err) => console.error('Error cargando departamentos:', err)
    });

    // Escuchar cambios de departamento para cargar ciudades
    this.formData.get('department')?.valueChanges.subscribe((depName) => {
      if (!depName) { this.cities$.next([]); return; }
      const deps = this.departments$.getValue();
      const foundDep = deps.find(d =>
        String(d.name).toLowerCase().trim() === String(depName).toLowerCase().trim() ||
        String(d.id) === String(depName)
      );
      if (foundDep?.id) {
        this.httpColombia.getCitiesByDepartment(foundDep.id).subscribe({
          next: (cities) => this.cities$.next(cities || []),
          error: (err) => console.error(err)
        });
      }
    });

    // Cargar datos del bar del usuario logueado
    if (user?.barId) {
      this.barId = user.barId;
      this.loadBarData(user.barId);
    } else if (user?._id) {
      // Intentar buscar el bar por userId
      this.httpBar.getBarByUserId(user._id).subscribe({
        next: (res: any) => {
          const bar = res?.data ?? res;
          if (bar?._id) {
            this.barId = bar._id;
            this.patchForm(bar);
          }
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  loadBarData(barId: string) {
    this.httpBar.getBarById(barId).subscribe({
      next: (res: any) => {
        const bar = res?.data ?? res;
        this.patchForm(bar);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  patchForm(bar: any) {
    this.formData.patchValue({
      name: bar.name || '',
      description: bar.description || '',
      imageUrl: bar.imageUrl || '',
      address: bar.address || '',
      department: bar.department || '',
      city: bar.city || '',
      capacity: bar.capacity || 0,
      contactPhone: bar.contactPhone || '',
      urlPage: bar.urlPage || '',
      isActive: bar.isActive ?? true,
    });

    // Cargar ciudades si hay departamento
    if (bar.department) {
      const deps = this.departments$.getValue();
      const foundDep = deps.find(d =>
        String(d.name).toLowerCase().trim() === String(bar.department).toLowerCase().trim()
      );
      if (foundDep?.id) {
        this.httpColombia.getCitiesByDepartment(foundDep.id).subscribe({
          next: (cities) => {
            this.cities$.next(cities || []);
            if (bar.city) {
              this.formData.patchValue({ city: bar.city });
            }
          }
        });
      }
    }
  }

  onSubmit() {
    if (this.formData.invalid) {
      this.errorMsg = 'Completa todos los campos requeridos';
      return;
    }
    this.errorMsg = '';
    this.successMsg = '';

    if (this.barId) {
      // Actualizar bar existente
      this.httpBar.updateBar(this.barId, this.formData.value).subscribe({
        next: () => {
          this.successMsg = '¡Datos del bar actualizados correctamente!';
        },
        error: (err) => {
          this.errorMsg = err.error?.msg || 'Error al actualizar el bar';
        }
      });
    } else {
      // Crear nuevo bar vinculado al usuario
      const user = this.httpAuth.getCurrentUser();
      const barData = { ...this.formData.value, userId: user?._id };
      this.httpBar.createBar(barData).subscribe({
        next: (res: any) => {
          this.barId = res?.data?._id || res?._id;
          this.successMsg = '¡Bar creado correctamente!';
        },
        error: (err) => {
          this.errorMsg = err.error?.msg || 'Error al crear el bar';
        }
      });
    }
  }
}
