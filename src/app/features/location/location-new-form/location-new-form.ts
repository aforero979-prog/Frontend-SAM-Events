import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-location-new-form',
  imports: [ReactiveFormsModule, AsyncPip, JsonPipe],
  templateUrl: './location-new-form.html',
  styleUrl: './location-new-form.css',
})
export class LocationNewForm {
  private httplocatios = inject(HttpLocations);
  formData: FormGroup;

  constructor() {
    //Define la estructura equivalente al formulario HTML, con los mismos nombres de los campos
    this.formData = new FormGroup({
      name: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      capacity: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
      imageUrl: new FormControl(''),
      locationInformation: new FormControl('')

    });
  }