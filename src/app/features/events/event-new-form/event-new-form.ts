import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpRoles } from '../../../core/services/http-roles';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-event-new-form',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe],   templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export class EventNewForm {
  private httpRoles = inject(HttpRoles);
roleList$ = new BehaviorSubject ([]); //RxJs: Observable que mantiene en memoria los datos de la API, para que puedan ser usados en el HTML.

  formData: FormGroup;

  constructor() {
    //Define la estructura equivalente al formulario HTML, con los mismos nombres de los campos
    this.formData = new FormGroup({
      name: new FormControl(``),
      price: new FormControl(``, [Validators.required, Validators.min(5000)]),
      stock: new FormControl(``, [Validators.required, Validators.min(1)]),
      initialDate: new FormControl(``),
      finalDate: new FormControl(``),
      imageUrl: new FormControl(``),
      eventLocation: new FormControl(``),
      eventSecret: new FormControl(false),
      eventInformation: new FormControl(``)

    });
  }

  onSubmit() {

    console.group("Formulario de evento nuevo");
    console.log("valid (formData) " + this.formData.valid);
    console.log("valid (name) " + this.formData.get('name')?.valid);
    console.log("valid (price) " + this.formData.get('price')?.valid);
    console.log("valid (stock) " + this.formData.get('stock')?.valid);
    console.groupEnd();

    // Aquí muestras valores diligenciados en el formulario.

    if (this.formData.valid) {
      console.log(this.formData.value);
    }
    else {
      console.log("Formulario inválido");

    }
  }
  ngOnInit() {
    //Observables
    this.httpRoles.getRoles().subscribe({
      next: (roles) => {
        console.log(roles);
        this.roleList$.next(roles);
      },

      error: (err) => {
        console.log(err);
      },

      complete: () => {
        console.log("Complete siempre se ejecuta ");
      }
    });
  }
}