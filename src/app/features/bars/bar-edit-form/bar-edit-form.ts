import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { HttpBar } from "../../../core/services/http-bar";
import { HttpApiColombia } from "../../../core/services/http-api-colombia";


@Component({
  selector: 'app-bar-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './bar-edit-form.html',
  styleUrl: './bar-edit-form.css',
})

export default class BarEditForm implements OnInit {
    selectedId!: string | null
    formData!: FormGroup
    private activatedRoute = inject( ActivatedRoute )
    private httpBar = inject( HttpBar )
    private httpColombia = inject( HttpApiColombia )
    private router = inject( Router )

    departments$ = new BehaviorSubject<any[]>([]);
    cities$ = new BehaviorSubject<any[]>([]);

    constructor() {
        this.formData = new FormGroup({
        name:         new FormControl('', [Validators.required]),
        description:  new FormControl('', [Validators.required]),
        imageUrl:     new FormControl('', [Validators.required]),
        department:   new FormControl(''),
        city:         new FormControl('', [Validators.required]),
        address:      new FormControl('', [Validators.required]),
        capacity:     new FormControl(0, [Validators.min(0)]),
        contactPhone: new FormControl(''),
        isActive:     new FormControl(true),
        })
    }

    ngOnInit() {
        this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');

        // Escuchar cambios manuales de departamento por el usuario
        this.formData.get('department')?.valueChanges.subscribe((depName) => {
            if (!depName) {
                this.cities$.next([]);
                return;
            }
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

        // 1. Obtener lista de departamentos
        this.httpColombia.getDepartments().subscribe({
            next: (deps) => {
                console.log('Departamentos de Colombia:', deps);
                this.departments$.next(deps || []);

                // 2. Cargar datos del bar actual
                if (this.selectedId) {
                    this.httpBar.getBarById(this.selectedId).subscribe({
                        next: (res) => {
                            const bar = res.data ?? res;
                            console.log('Bar cargado para edicion:', bar);

                            // Buscar coincidencia del departamento (por nombre o id)
                            const matchedDep = deps.find(d => 
                                String(d.name).toLowerCase().trim() === String(bar.department).toLowerCase().trim() ||
                                String(d.id) === String(bar.department)
                            );

                            const depVal = matchedDep ? matchedDep.name : (bar.department || '');

                            this.formData.patchValue({
                                name: bar.name || '',
                                description: bar.description || '',
                                imageUrl: bar.imageUrl || '',
                                address: bar.address || '',
                                capacity: bar.capacity || 0,
                                contactPhone: bar.contactPhone || '',
                                isActive: bar.isActive ?? true,
                                department: depVal
                            });

                            // 3. Cargar ciudades si hay un departamento coincidente
                            if (matchedDep?.id) {
                                this.httpColombia.getCitiesByDepartment(matchedDep.id).subscribe({
                                    next: (cities) => {
                                        this.cities$.next(cities || []);

                                        const matchedCity = cities.find(c =>
                                            String(c.name).toLowerCase().trim() === String(bar.city).toLowerCase().trim() ||
                                            String(c.id) === String(bar.city)
                                        );
                                        const cityVal = matchedCity ? matchedCity.name : (bar.city || '');
                                        this.formData.patchValue({ city: cityVal });
                                    },
                                    error: (err) => console.error(err)
                                });
                            } else if (bar.city) {
                                // Si no hay departamento pero hay ciudad previa
                                this.formData.patchValue({ city: bar.city });
                            }
                        },
                        error: (err) => console.error(err)
                    });
                }
            },
            error: (err) => console.error(err)
        });
    }

    onSubmit() {
        if( this.formData.valid ) {
            console.log( this.formData.value )
            this.httpBar.updateBar( this.selectedId, this.formData.value).subscribe({
                next: ( data ) => {
                    console.log( data ) 
                    this.router.navigateByUrl( '/dashboard/bars' )
                },
                error: ( err ) => {
                    console.error( err )
                },
                complete: () => {
                    console.log( 'La informacion del bar ha sido editada correctamente' )
                }
            })
        } else {
            console.log( 'El formulario no es valido' )
        }
    }

    get name() {
        return this.formData.get( 'name' )
    }
}