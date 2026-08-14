import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpBar } from "../../../core/services/http-bar";


@Component({
  selector: 'app-bar-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bar-edit-form.html',
  styleUrl: './bar-edit-form.css',
})

export default class BarEditForm {
    selectedId!: string | null
    formData!: FormGroup
    private activatedRoute = inject( ActivatedRoute )
    private httpBar = inject( HttpBar )
    private router = inject( Router )

    constructor() {
        this.formData = new FormGroup({
        name:         new FormControl('', [Validators.required]),
        description:  new FormControl('', [Validators.required]),
        imageUrl:     new FormControl('', [Validators.required]),
        address:      new FormControl('', [Validators.required]),
        capacity:     new FormControl(0, [Validators.min(0)]),
        contactPhone: new FormControl(''),
        isActive:     new FormControl(true),
        })
    }

    ngOnInit() {
        this.selectedId = this.activatedRoute.snapshot.paramMap.get( 'id' )

        this.httpBar.getBarById( this.selectedId ).subscribe({
            next: ( data ) => {
                console.log( data.data )

                const { name, description, imageUrl, address, capacity, contactPhone, isActive } = data.data

                this.formData.patchValue({
                    name: name,
                    description: description, 
                    imageUrl: imageUrl, 
                    address: address, 
                    capacity: capacity, 
                    contactPhone: contactPhone, 
                    isActive: isActive
                })
            },
            error: ( err ) => {
                console.error( err )
            },
            complete: () => {
                console.log( 'Bar encontrado por ID con exito')
            }
        })
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
                    console.log( 'La informacion del bar ha sido actualizada' )
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