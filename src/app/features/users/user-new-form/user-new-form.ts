import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpUser } from '../../../core/services/http-user';
import { HttpRolesUser } from '../../../core/services/http-roles-user';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export default class UserNewForm {

  private httpUser = inject(HttpUser);
  private httpRoles = inject(HttpRolesUser);
  private router = inject(Router);

  // RxJs: Observable que mantiene en memoria los roles de la API, para que puedan ser usados en el HTML.
  roleList$ = new BehaviorSubject<any[]>([]);

  // Atributo de la clase que va a contener el formulario
  formData: FormGroup;

  constructor() {
    // Define la estructura equivalente al formulario HTML, con los mismos nombres de los campos del modelo del backend
    this.formData = new FormGroup({
      name: new FormControl(``, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(``, [Validators.required, Validators.email]),
      password: new FormControl(``, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(``, [Validators.required]),
      role: new FormControl(``, [Validators.required]),
      avatar: new FormControl(``),
      isActive: new FormControl(true),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      // Extraemos confirmPassword: el backend no la espera
      const { confirmPassword, ...userPayload } = this.formData.value;
      console.log(userPayload);

      this.httpUser.createUser(userPayload).subscribe({
        next: (res) => {
          console.log(res);
          // Navegar de vuelta a la lista tras guardar con éxito
          this.router.navigate(['/user-list']);
        },
        error: (err) => { console.log(err); },
        complete: () => { console.log('Usuario creado'); }
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  // Hook: ciclo de vida que sabe cuando se inicializa el componente
  ngOnInit() {
    // Cargar la lista de roles desde el backend
    this.httpRoles.getAll().subscribe({
      next: (res) => {
        this.roleList$.next(res.data);
        console.log(res.data);
      },
      error: (err) => { console.log(err); },
      complete: () => { }
    });
  }
}
