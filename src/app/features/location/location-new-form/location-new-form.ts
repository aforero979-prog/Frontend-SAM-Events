
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpLocations } from '../../../core/services/http-locations';

@Component({
  selector: 'app-location-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './location-new-form.html',
  styleUrl: './location-new-form.css',
})
export default class LocationNewForm {

  private httpLocations = inject(HttpLocations);

  formData: FormGroup;
  successMsg = '';
  errorMsg = '';

  constructor() {
    this.formData = new FormGroup({
      name:     new FormControl('', [Validators.required]),
      address:  new FormControl('', [Validators.required]),
      capacity: new FormControl(0, [Validators.min(0)]),
      status:   new FormControl(true)
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpLocations.createLocation(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
          this.successMsg = 'Ubicación creada correctamente';
          this.errorMsg = '';
          this.formData.reset({ status: true, capacity: 0 });
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = err.error?.msg || 'Error al crear la ubicación';
          this.successMsg = '';
        },
        complete: () => { console.log('complete'); }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}