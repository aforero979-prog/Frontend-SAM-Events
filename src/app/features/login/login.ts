import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login {

  private http = inject(HttpClient);
  private router = inject(Router);

  formData = new FormGroup({
    email: new FormControl(``, [Validators.required, Validators.email]),
    password: new FormControl(``, [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.formData.valid) {
      const credentials = this.formData.value;

      this.http.post<any>(`http://localhost:3000/api/auth/login`, credentials).subscribe({
        next: (res) => {
          console.log('Login exitoso:', res);
          // Guardar el token en localStorage para que el interceptor lo use
          localStorage.setItem('token', res.token);
          // Navegar al home o user-list tras login exitoso
          this.router.navigate(['/user-list']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
