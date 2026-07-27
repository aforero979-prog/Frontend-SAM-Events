import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm {
  formData!: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      status: new FormControl(true),
    });
  }

  onSubmit() {
    if ( this.formData.valid ) {
      console.log( this.formData.value)
    } else {
      console.log( 'El formulario no es válido' );
    }
  }

    get name() {
    return this.formData.get( 'name' )
  }
}
