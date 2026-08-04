import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpAuth } from '../../core/services/http-auth';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {

  formData: FormGroup;
  private httpAuth = inject(HttpAuth);
  private router = inject(Router);

  constructor() {
    this.formData = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);

      //Usar el servicio para conectar con la API
      this.httpAuth.loginUser(this.formData.value).subscribe({
        next: (data) => {
          console.log(data);

          this.formData.reset(); //Limpiamos los campos del formulario
          this.router.navigateByUrl('/dashboard')
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('login satisfactorio');
        },
      });
    } else {
      console.log('Formulario invalido');

    }
  }
}
