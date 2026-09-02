import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpMusic } from '../../../core/services/http-music';

@Component({
  selector: 'app-music-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './music-new-form.html',
  styleUrl: './music-new-form.css',
})
export default class MusicNewForm {
  private httpMusic = inject(HttpMusic);
  private router = inject(Router);

  successMsg = '';
  errorMsg = '';
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      isActive: new FormControl(true),
      youtubeUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/),
      ])
    });
  }

  // onSubmit() {
  //   if (this.formData.valid) {
  //     let payload = { ...this.formData.value };
  //     this.httpMusic.createMusic(payload).subscribe({
  //       next: (res) => {
  //         this.successMsg = 'Música añadida correctamente';
  //         this.errorMsg = '';
  //         this.formData.reset();
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         this.errorMsg = error.error?.msg || 'Error al añadir música';
  //         this.successMsg = '';
  //       }
  //     });
  //   }
  // }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);
      this.httpMusic.createMusic(this.formData.value).subscribe({
        next: (data) => {
          console.log(data);
          this.formData.reset();
          this.router.navigateByUrl('/dashboard/music');
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          console.log('Canción registrada');
        },
      });
    } else {
      console.log('El formulario no es valido');
    }
  }

  get name() {
    return this.formData.get('name');
  }
}
