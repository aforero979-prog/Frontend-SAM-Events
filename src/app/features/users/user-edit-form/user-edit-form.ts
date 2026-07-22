import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpUser } from '../../../core/services/http-user';
import { HttpRolesUser } from '../../../core/services/http-roles-user';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './user-edit-form.html',
  styleUrl: './user-edit-form.css',
})
export default class UserEditForm {
  selectedId!: string | null; // Evita que Typescript me obligue a definir el valor del atributo.

  private activateRoute = inject(ActivatedRoute);
  private httpUser = inject(HttpUser);
  private httpRoles = inject(HttpRolesUser);
  private router = inject(Router);

  // RxJs: Observable que mantiene en memoria los roles de la API, para que puedan ser usados en el HTML.
  roleList$ = new BehaviorSubject<any[]>([]);

  formData: FormGroup;

  constructor() {
    // Define la estructura equivalente al formulario HTML, con los mismos nombres de los campos del modelo del backend
    this.formData = new FormGroup({
      name: new FormControl(``, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl(``, [Validators.required, Validators.email]),
      role: new FormControl(``, [Validators.required]),
      isActive: new FormControl(true),
    });
  }

  onSubmit() {
    // Si el formulario es valido y el id es valido
    if (this.formData.valid && this.selectedId) {
      const userData = { ...this.formData.value };

      console.log('Enviando actualización:', userData);

      this.httpUser.updateUser(this.selectedId, userData).subscribe({
        next: (res) => {
          console.log('Usuario actualizado:', res);
          // Navegar de vuelta a la lista tras guardar con éxito
          this.router.navigate(['/user-list']);
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  ngOnInit() {
    // Obtener el id del usuario desde la URL (Solamente cuando el formulario de editar es un componente de pagina)
    this.selectedId = this.activateRoute.snapshot.paramMap.get(`id`);

    // Cargar la lista de roles
    this.httpRoles.getAll().subscribe({
      next: (res) => {
        this.roleList$.next(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });

    // Precargar el formulario con los datos del usuario a editar
    if (this.selectedId) {
      this.httpUser.getUserById(this.selectedId).subscribe({
        next: (res: any) => {
          console.log('Usuario cargado:', res);
          // El backend responde { data: { ... } }
          const user = res.data ?? res;
          this.formData.patchValue({
            name: user.name,
            email: user.email,
            role: user.role,         // es un string simple: "admin" | "user" | "company"
            isActive: user.isActive,
          });
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
  //Getter para facilitar el acceso a los campos del formulario
  get name() {
    return this.formData.get('name');
  }

  get email() {
    return this.formData.get('email');
  }
}
