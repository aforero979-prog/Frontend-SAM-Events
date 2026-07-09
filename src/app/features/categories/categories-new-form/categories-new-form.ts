import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
})
export class CategoriesNewForm {

  formData: FormGroup;

  constructor() {

    this.formData = new FormGroup({
      //Define la estructura equivalente del formulario
      name: new FormControl(),
      description: new FormControl(),
      status: new FormControl()

    })
  }

  onEnviar() {
    console.log(this.formData.value)
  }

}
