import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpUser } from '../../../core/services/http-user';
import { HttpAuth } from '../../../core/services/http-auth';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export default class UserProfile implements OnInit {
  userId!: string | null;

  private httpUser = inject(HttpUser);
  private httpAuth = inject(HttpAuth);
  private router = inject(Router);

  formData: FormGroup;
  successMsg = '';
  errorMsg = '';
  isLoading = true;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    this.httpAuth.currentUser$.subscribe(user => {
      if (!user) return;

      this.userId = user._id || null;
      if (this.userId) {
        this.httpUser.getUserById(this.userId).subscribe({
          next: (res: any) => {
            const userData = res.data ?? res;
            this.formData.patchValue({
              name: userData.name,
              email: userData.email,
            });
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error cargando usuario', err);
            this.isLoading = false;
          }
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.formData.invalid || !this.userId) return;

    this.errorMsg = '';
    this.successMsg = '';

    const userData = { ...this.formData.value };

    this.httpUser.updateUser(this.userId, userData).subscribe({
      next: (res: any) => {
        this.successMsg = '¡Tu perfil se ha actualizado correctamente!';
        
        // Actualizamos localmente el token / current user para reflejar el nuevo nombre si es necesario
        // O simplemente dejamos que el usuario lo vea actualizado
        const updatedUser = res.data ?? res;
        this.httpAuth.updateLocalUser(updatedUser); 
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || 'Error al actualizar tu perfil.';
        console.error(err);
      }
    });
  }

  get name() { return this.formData.get('name'); }
  get email() { return this.formData.get('email'); }
}
