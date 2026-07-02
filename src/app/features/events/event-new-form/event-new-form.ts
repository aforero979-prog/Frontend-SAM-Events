import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './event-new-form.html',
  styleUrl: './event-new-form.css',
})
export class EventNewForm {
  formData: FormGroup;

  constructor() {
    //Define la estructura equivalente al formulario HTML, con los mismos nombres de los campos
    this.formData = new FormGroup({
      name: new FormControl(),
      price: new FormControl(),
      stock: new FormControl(),
      initialDate: new FormControl(),
      finalDate: new FormControl(),
      imageUrl: new FormControl(),
      eventLocation: new FormControl(),
      eventSecret: new FormControl(),
      eventInformation: new FormControl()

    });
  }

onSubmit() {

  // Aquí muestras valores diligenciados en el formulario.
  console.log(this.formData.value); 
}

}