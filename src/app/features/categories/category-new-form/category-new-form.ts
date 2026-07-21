import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {
  formData!: FormGroup;
  private httpCategory = inject ( HttpCategory )
  private router = inject ( Router )
  
  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      status: new FormControl( true )
    });
  }


  onSubmit() {

    if( this.formData.valid ) {
    console.log( this.formData.value ) //Me va a mostrar todos los valores del formulario
    this.httpCategory.createCategory( this.formData.value ).subscribe({ 
      next: ( data ) => {
        console.log( data )
        this.formData.reset()
        this.router.navigateByUrl( '/category/list' )
      },
      error: ( err ) => {
        console.error( err )
      },
      complete: () => {
        console.log( 'Categoría registrada' )
      }
    })
    }else { 
      console.log( 'El formulario no es valido' )
    }
  }


  get name() {
    return this.formData.get( 'name' )
  }
}
