import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpMusic } from '../../../core/services/http-music';

@Component({
  selector: 'app-music-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './music-edit-form.html',
  styleUrl: './music-edit-form.css',
})
export default class MusicEditForm implements OnInit {
  private httpMusic = inject(HttpMusic);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  successMsg = '';
  errorMsg = '';
  formData: FormGroup;
  musicId = '';

  constructor() {
    this.formData = new FormGroup({
      youtubeUrl: new FormControl('', [
        Validators.required, 
        Validators.pattern(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)
      ]),
    });
  }

  ngOnInit() {
    this.musicId = this.route.snapshot.paramMap.get('id') || '';
    if (this.musicId) {
      this.httpMusic.getMusicById(this.musicId).subscribe({
        next: (res: any) => {
          const music = res.data || res;
          this.formData.patchValue({ youtubeUrl: music.youtubeUrl });
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'No se pudo cargar la canción';
        }
      });
    }
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpMusic.updateMusic(this.musicId, this.formData.value).subscribe({
        next: (res) => {
          this.successMsg = 'Música actualizada correctamente';
          this.errorMsg = '';
          setTimeout(() => this.router.navigateByUrl('/dashboard/music'), 1500);
        },
        error: (error) => {
          console.error(error);
          this.errorMsg = error.error?.msg || 'Error al actualizar música';
          this.successMsg = '';
        }
      });
    }
  }
}
