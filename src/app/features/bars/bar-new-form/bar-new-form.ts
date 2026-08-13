import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
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

    // Observables para manejar los departamentos y ciudades
    departments$ = new BehaviorSubject<any[]>([]);
    cities$ = new BehaviorSubject<any[]>([]);

    // Formulario
    formData: FormGroup;

    constructor() {
        this.formData = new FormGroup({
            name: new FormControl('', [Validators.required]),
            description: new FormControl('', [Validators.required]),
            imageUrl: new FormControl('', [Validators.required]),
            department: new FormControl(''),
            city: new FormControl(''),
            address: new FormControl('', [Validators.required]),
            capacity: new FormControl(0, [Validators.min(0)]),
            contactPhone: new FormControl(''),
            isActive: new FormControl(true),
        });
    }

    ngOnInit() {
        // Trae los departamentos de Colombia
        this.httpColombia.getDepartments().subscribe({
            next: (deps) => {
                console.log('Departamentos obtenidos:', deps);
                this.departments$.next(deps || []);
            },
            error: (err) => console.error('Error al obtener departamentos:', err)
        });

        // Detecta el cambio de departamento para traer las ciudades
        // valueChanges es un observable que emite el nuevo valor del formulario
        this.formData.get('department')?.valueChanges.subscribe((departmentId) => {
            console.log('Departamento seleccionado:', departmentId);
            // Resetear la ciudad
            this.formData.get('city')?.setValue('');

            if (departmentId) {
                // Trae las ciudades del departamento seleccionado
                this.httpColombia.getCitiesByDepartment(departmentId).subscribe({
                    next: (cities) => {
                        console.log('Ciudades obtenidas:', cities);
                        this.cities$.next(cities || []);
                    },
                    error: (err) => console.error('Error al obtener ciudades:', err)
                });
            } else {
                this.cities$.next([]);
            }
        });
    }

    // onSubmit() {
    //   if (this.formData.invalid) return;

    //   this.httpBar.createBar(this.formData.value).subscribe({
    //     next: (res) => {
    //       console.log('Bar creado:', res);
    //       alert('Bar creado exitosamente');
    //       this.router.navigateByUrl('/dashboard/bars');
    //     },
    //     error: (err) => console.error('Error creando bar', err),
    //   });
    // }

    onSubmit() {
        if (this.formData.valid) {
            console.log(this.formData.value)
            this.httpBar.createBar(this.formData.value).subscribe({
                next: (data) => {
                    console.log(data)
                    this.formData.reset()
                    this.router.navigateByUrl('/bar/list')
                },
                error: (err) => {
                    console.error(err)
                },
                complete: () => {
                    console.log('Bar registrado')
                }
            })
        } else {
            console.log('El formulario no es valido')
        }
    }

    get name() {
        return this.formData.get('name')
    }

}
