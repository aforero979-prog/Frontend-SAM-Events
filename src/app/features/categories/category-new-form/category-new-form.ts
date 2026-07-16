import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';

@Component({
  selector: 'app-category-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-new-form.html',
  styleUrl: './category-new-form.css',
})
export default class CategoryNewForm {
  formData!: FormGroup;
  
  constructor() {
    this.formData = new FormGroup({
      name: new FormControl(),
      description: new FormControl(),
      location: new FormControl(),
      status: new FormControl(true)
    });
  }

  onSubmit() {
    console.log( this.formData.value ) //Me va a mostrar todos los valores del formulario
  }
}
