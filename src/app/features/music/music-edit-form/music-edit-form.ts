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
      name: new FormControl('', [Validators.required]),
      artist: new FormControl('', [Validators.required]),
      genre: new FormControl('', [Validators.required]),
      imageUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/).+$/),
      ]),
      isActive: new FormControl(true),
      youtubeUrl: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(https?:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/),
      ]),
    });
  }

  ngOnInit() {
    // 1. REVISAR: ¿El nombre en el ActivatedRoute coincide con las rutas?
    this.musicId = this.route.snapshot.paramMap.get('id') || '';
    
    console.log('🔍 ID capturado desde la URL:', this.musicId);

    if (this.musicId) {
      this.loadMusicData(this.musicId);
    } else {
      this.errorMsg = 'No se encontró un ID válido en la URL';
      console.error('❌ El ID en la URL es null/vacío. Revisa app.routes.ts');
    }
  }

  private loadMusicData(id: string) {
    this.httpMusic.getMusicById(id).subscribe({
      next: (res: any) => {
        console.log('📦 Respuesta exacta recibida del Backend:', res);

        // Desestructuración para soportar diferentes formatos de respuesta del backend
        const music = res?.data || res?.music || res;

        console.log('🎵 Objeto procesado para patchValue:', music);

        if (music && typeof music === 'object') {
          this.formData.patchValue({
            name: music.name || music.title || '',
            artist: music.artist || '',
            genre: typeof music.genre === 'object' ? music.genre?.name || music.genre?._id : music.genre || '',
            imageUrl: music.imageUrl || music.image || '',
            youtubeUrl: music.youtubeUrl || music.youtube_url || '',
            isActive: music.isActive ?? true,
          });

          console.log('✅ Formulario actualizado. Valores actuales:', this.formData.value);
        } else {
          console.warn('⚠️ La respuesta de la API no contiene un objeto válido.');
        }
      },
      error: (err) => {
        console.error('❌ Error al consultar la API:', err);
        this.errorMsg = 'Error al conectar con el servidor para obtener los datos';
      },
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpMusic.updateMusic(this.musicId, this.formData.value).subscribe({
        next: () => {
          this.successMsg = 'Música actualizada correctamente';
          this.errorMsg = '';
          setTimeout(() => this.router.navigateByUrl('/dashboard/music'), 1500);
        },
        error: (error) => {
          console.error(error);
          this.errorMsg = error.error?.msg || 'Error al actualizar la música';
          this.successMsg = '';
        },
      });
    }
  }
}