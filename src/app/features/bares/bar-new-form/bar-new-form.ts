import { Component, inject } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { HttpBar } from "../../../core/services/http-bar";

@Component({
  selector: 'app-bar-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bar-new-form.html',
  styleUrl: './bar-new-form.css'
})

export default class BarCreateComponent {

    formData!: FormGroup

    barList$ = new BehaviorSubject<any[]>([])

    private router = inject( Router )
    private httpBar = inject( HttpBar )

    constructor() {
        this.formData = new FormGroup({
            name: new FormControl(''),
            description: new FormControl(''),
            imageUrl: new FormControl(''),
            address: new FormControl(''),
            capacity: new FormControl(''),
            contactPhone: new FormControl(''),
            isActive: new FormControl('')
        })
    }

    onSubmit() {
        if( this.formData.valid ) {
            console.log( this.formData.value )
            this.httpBar.createBar( this.formData.value ).subscribe({
                next: ( data ) => {
                    console.log( data )
                    this.formData.reset()
                    this.router.navigateByUrl( '/bar/list' )
                },
                error: ( err ) => {
                    console.error( err ) 
                },
                complete: () => {
                    console.log( 'Bar registrado' )
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