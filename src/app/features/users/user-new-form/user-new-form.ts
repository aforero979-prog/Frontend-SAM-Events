import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { HttpUser } from '../../../core/service/http-user';
import { HttpRoles, Role } from '../../../core/service/http-roles';
import { BehaviorSubject, Observable } from 'rxjs';

// Estados posibles del formulario durante el envío
type FormState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {

  // Servicios inyectados
  private httpUser  = inject(HttpUser);
  private httpRoles = inject(HttpRoles);

  // Observable de roles: el async pipe se suscribe y desuscribe automáticamente
  roles$: Observable<{ msg: string; data: Role[] }> = this.httpRoles.getAll();

  // BehaviorSubject: controla el estado del formulario durante el envío.
  // Requiere un valor inicial ('idle') y emite el estado actual a cualquier suscriptor.
  private formState$$ = new BehaviorSubject<FormState>('idle');

  // Exponemos el observable público para usar en el template con async pipe
  formState$ = this.formState$$.asObservable();

  // Definición del formulario reactivo
  formData = new FormGroup({
    name:            new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email:           new FormControl('', [Validators.required, Validators.email]),
    password:        new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
    confirmPassword: new FormControl('', [Validators.required]),
    role:            new FormControl('', [Validators.required]),
    avatar:          new FormControl(''),
    isActive:        new FormControl(true),
  });

  // Maneja el envío del formulario
  onSubmit(): void {
    console.group('Estado del formulario');
    console.log('¿Válido?:',     this.formData.valid);
    console.log('name válido:',  this.formData.get('name')?.valid);
    console.log('email válido:', this.formData.get('email')?.valid);
    console.groupEnd();

    if (this.formData.invalid) {
      console.log('Formulario inválido');
      return;
    }

    // Cambia el estado a 'loading' → bloquea el botón en el template
    this.formState$$.next('loading');

    this.httpUser.create(this.formData.value as any).subscribe({
      next: (res) => {
        console.log('Usuario creado:', res);
        this.formState$$.next('success'); // Cambia estado a éxito
        this.formData.reset({ isActive: true }); // Limpia el formulario
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.formState$$.next('error'); // Cambia estado a error
      }
    });
  }
}
