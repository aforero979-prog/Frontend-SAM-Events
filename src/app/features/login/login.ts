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
  errorMsg = '';

  constructor() {
    this.formData = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.errorMsg = '';

      //Usar el servicio para conectar con la API
      this.httpAuth.loginUser(this.formData.value).subscribe({
        next: (msg) => {
          console.log(msg);
          this.formData.reset();
          // Muestra un anuncio de confirmación al usuario
          alert('¡Inicio de sesión exitoso! Bienvenido.');
          
          // Navega al dashboard dependiendo del rol
          const userObj = this.httpAuth.getCurrentUser();
          if (userObj?.role === 'BAR') {
            this.router.navigateByUrl('/bar-dashboard');
          } else {
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error?.msg || err.message || 'Error al iniciar sesión';
        },
      });
    } else {
      this.errorMsg = 'Completa todos los campos correctamente';
    }
  }
}
