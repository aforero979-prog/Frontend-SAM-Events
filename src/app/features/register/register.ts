import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export default class Register {

  formData: FormGroup
  
  constructor() {
    this.formData = new FormGroup({
      name: new FormGroup(''),
      nit: new FormGroup(''),
      email: new FormGroup(''),
      password: new FormGroup('')
    })
  }

  onSubmit() {
    if(this.formData.valid) {
      console.log( this.formData.value )
      
    } else {
      console.log( 'Error al registar el usuario' )
    }
  }
}
