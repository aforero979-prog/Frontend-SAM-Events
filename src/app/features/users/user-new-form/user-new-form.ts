import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpUser } from '../../../core/service/http-user';
import { HttpRoles } from '../../../core/service/http-roles';

@Component({
  selector: 'app-user-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-new-form.html',
  styleUrl: './user-new-form.css',
})
export class UserNewForm {

  private httpUser = inject(HttpUser);
  private httpRoles = inject(HttpRoles);

  // Atributo de la clase que va a contener el formulario
  formData: FormGroup;

  // Lista de roles cargada desde el backend
  roles: any[] = [];

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
      // Extraemos confirmPassword: el backend no la espera
      const { confirmPassword, ...userPayload } = this.formData.value;
      console.log(userPayload);

      this.httpUser.createUser(userPayload).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => { console.error(error); },
        complete: () => { console.log('complete execute'); }
      });
    } else {
      console.log('El formulario no es valido');
    }
  }
  // Hook: ciclo de vida que se ejecuta cuando se inicializa el componente
  ngOnInit() {
    this.httpRoles.getAll().subscribe({
      next: (res: any) => {
        this.roles = res.data;
        console.log(this.roles);
      },
      error: (err) => { console.error(err); },
      complete: () => { }
    });
  }

}
