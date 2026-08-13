import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpBar } from '../../../core/services/http-bar';

@Component({
  selector: 'app-bar-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './bar-new-form.html',
  styleUrl: './bar-new-form.css',
})
export default class BarNewForm {
  private httpBar = inject(HttpBar);
  private router = inject(Router);

  cities = ['Bogotá', 'Cali', 'Pereira', 'Medellín', 'Cartagena', 'Neiva'];

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name:         new FormControl('', [Validators.required]),
      description:  new FormControl('', [Validators.required]),
      imageUrl:     new FormControl('', [Validators.required]),
      city:         new FormControl('', [Validators.required]),
      address:      new FormControl('', [Validators.required]),
      urlPage:      new FormControl(''),
      capacity:     new FormControl(0, [Validators.min(0)]),
      contactPhone: new FormControl(''),
      isActive:     new FormControl(true),
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
