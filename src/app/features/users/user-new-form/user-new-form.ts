import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {
  formData: FormGroup
  constructor() {
    this.formData = new FormGroup({
      name: new FormControl(),
      email: new FormControl(),
      password: new FormControl(),
      role: new FormControl(),
      avatar: new FormControl(),
      isActive: new FormControl()
    });
  }
  onSubmit() {
    console.log(this.formData.value) // ver que se guardan los datos del formulario 
  }
}
