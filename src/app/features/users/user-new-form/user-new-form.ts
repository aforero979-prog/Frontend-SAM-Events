import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpUser } from '../../../core/services/http-user';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export default class UserNewForm {

  private httpUser = inject(HttpUser);
  private router = inject(Router);

  roles = ['admin', 'user', 'tiar'];
  formData: FormGroup;
  errorMsg = '';
  successMsg = '';

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      avatar: new FormControl(''),
      isActive: new FormControl(true),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.errorMsg = '';
      this.successMsg = '';
      const { confirmPassword, ...userPayload } = this.formData.value;
      
      this.httpUser.createUser(userPayload).subscribe({
        next: (res) => {
          this.successMsg = 'Usuario creado con éxito';
          this.router.navigate(['/dashboard/user-list']);
        },
        error: (err) => { 
          console.log(err);
          this.errorMsg = err.error?.msg || 'Error al crear el usuario';
        }
      });
    } else {
      this.errorMsg = 'Formulario inválido, por favor verifica los campos';
    }
  }

  get name() { return this.formData.get('name'); }
  get email() { return this.formData.get('email'); }
  get password() { return this.formData.get('password'); }
  get confirmPassword() { return this.formData.get('confirmPassword'); }
  get role() { return this.formData.get('role'); }
  get avatar() { return this.formData.get('avatar'); }
  get isActive() { return this.formData.get('isActive'); }
}
