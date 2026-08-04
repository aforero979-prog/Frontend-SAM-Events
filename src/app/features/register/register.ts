import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { HttpRegister } from '../../core/services/http-register';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export default class Register {

  private httpRegister = inject(HttpRegister);
  private router = inject(Router);

  formData: FormGroup;
  successMsg = '';
  errorMsg = '';
  
  constructor() {
    this.formData = new FormGroup({
      name:     new FormControl(''),
      email:    new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpRegister.createUser(this.formData.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.successMsg = res?.msg || 'Usuario registrado correctamente';
          this.errorMsg = '';
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error?.msg || 'Error al registrar el usuario';
          this.successMsg = '';
        }
      });
    } else {
      console.log( 'Formulario inválido' );
    }
  }
}
