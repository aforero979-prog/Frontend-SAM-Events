import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpPost } from '../../../core/services/http-post';

// tipos de publicacion definidos en el backend
const POST_TYPES = ['general', 'evento', 'banda', 'noticia'];

@Component({
  selector: 'app-post-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './post-new-form.html',
  styleUrl: './post-new-form.css',
})
export default class PostNewForm {

  private httpPost = inject(HttpPost);

  // tipos disponibles para el select de tipo de publicacion
  postTypes = POST_TYPES;

  // atributo de la clase que va a contener el formulario
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      title:    new FormControl('', [Validators.required, Validators.minLength(3)]),
      content:  new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
      type:     new FormControl('general', [Validators.required]),
      author:   new FormControl('', [Validators.required]),
      event:    new FormControl(''),
      isActive: new FormControl(true),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);

      this.httpPost.createPost(this.formData.value).subscribe({
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
}
