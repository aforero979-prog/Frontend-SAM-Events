import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpUser } from '../../../core/services/http-user';
import { HttpBar } from '../../../core/services/http-bar';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export default class UserNewForm {

  private httpUser = inject(HttpUser);
  private httpBar = inject(HttpBar);
  private router = inject(Router);

  roles = ['ADMIN', 'USER', 'BAR'];
  formData: FormGroup;
  errorMsg = '';
  successMsg = '';
  isBarRole = false;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      avatar: new FormControl(''),
      isActive: new FormControl(true),
      // Campos de bar (opcionales, solo cuando role=BAR)
      barName: new FormControl(''),
      barDescription: new FormControl(''),
      barImageUrl: new FormControl(''),
    });

    // Escuchar cambios en el rol para mostrar/ocultar campos de bar
    this.formData.get('role')?.valueChanges.subscribe((role) => {
      this.isBarRole = role === 'BAR';
      if (this.isBarRole) {
        this.formData.get('barName')?.setValidators([Validators.required]);
        this.formData.get('barDescription')?.setValidators([Validators.required]);
        this.formData.get('barImageUrl')?.setValidators([Validators.required]);
      } else {
        this.formData.get('barName')?.clearValidators();
        this.formData.get('barDescription')?.clearValidators();
        this.formData.get('barImageUrl')?.clearValidators();
      }
      this.formData.get('barName')?.updateValueAndValidity();
      this.formData.get('barDescription')?.updateValueAndValidity();
      this.formData.get('barImageUrl')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.errorMsg = '';
      this.successMsg = '';
      const { confirmPassword, barName, barDescription, barImageUrl, ...userPayload } = this.formData.value;

      this.httpUser.createUser(userPayload).subscribe({
        next: (res: any) => {
          const createdUser = res?.data || res;
          const userId = createdUser?._id;

          // Si el rol es BAR, crear el bar vinculado al usuario
          if (this.isBarRole && userId) {
            const barData = {
              name: barName,
              description: barDescription,
              imageUrl: barImageUrl,
              userId: userId,
              city: '',
              address: '',
              isActive: true,
            };

            this.httpBar.createBar(barData).subscribe({
              next: (barRes: any) => {
                const barId = barRes?.data?._id || barRes?._id;
                // Actualizar el usuario con el barId
                if (barId) {
                  this.httpUser.updateUser(userId, { barId }).subscribe({
                    next: () => {
                      this.successMsg = 'Usuario y bar creados con éxito';
                      this.router.navigate(['/dashboard/users']);
                    },
                    error: () => {
                      this.successMsg = 'Usuario y bar creados (vinculación pendiente)';
                      this.router.navigate(['/dashboard/users']);
                    }
                  });
                } else {
                  this.successMsg = 'Usuario y bar creados con éxito';
                  this.router.navigate(['/dashboard/users']);
                }
              },
              error: (err) => {
                this.errorMsg = 'Usuario creado, pero error al crear el bar: ' + (err.error?.msg || '');
              }
            });
          } else {
            this.successMsg = 'Usuario creado con éxito';
            this.router.navigate(['/dashboard/users']);
          }
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
