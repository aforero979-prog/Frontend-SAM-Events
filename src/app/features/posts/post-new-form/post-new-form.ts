import { Component, inject } from '@angular/core'; // los inject nos sirve para injectar servicios 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // los import de formcontrol, formgroup, reactiveforms y validators nos sirven para poder crear formularios reactivos
import { Router } from '@angular/router'; // los import de router nos sirve para poder navegar entre paginas
import { HttpPost } from '../../../core/services/http-post'; // los import de httpposts nos sirve para poder hacer peticiones http
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
// tipos de publicacion definidos en el backend
const POST_TYPES = ['general', 'evento', 'banda', 'noticia'];

@Component({
  selector: 'app-post-new-form',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './post-new-form.html',
  styleUrl: './post-new-form.css',
})
export default class PostNewForm {

  private httpPost = inject(HttpPost);
  private router = inject(Router);

  // tipos disponibles para el select de tipo de publicacion
  postTypes = POST_TYPES;

  // atributo de la clase que va a contener el formulario
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', [Validators.required]),
      imageUrl: new FormControl(''),
      type: new FormControl('general', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      event: new FormControl(''),
      isActive: new FormControl(true),
    });
  }
  // al presionar el boton de enviar se ejecuta esta funcion
  onSubmit() {
    // si el formulario es valido se ejecuta lo siguiente
    if (this.formData.valid) {
      console.log(this.formData.value);
      // se hace la peticion http
      this.httpPost.createPost(this.formData.value).subscribe({
        // si la peticion es exitosa se ejecuta lo siguiente
        next: (res) => {
          console.log(res);
          // se navega a la lista de posts
          this.router.navigate(['/post-list']);
        },
        // si la peticion falla se ejecuta lo siguiente
        error: (error) => { console.error(error); },
        complete: () => { console.log('complete execute'); }
      });
    } else {
      console.log('El formulario no es valido');
    }
  }
  // getters para acceder a los campos del formulario
  get title() {
    return this.formData.get('title');
  }
  get content() {
    return this.formData.get('content');
  }
  get imageUrl() {
    return this.formData.get('imageUrl');
  }
  get type() {
    return this.formData.get('type');
  }
  get author() {
    return this.formData.get('author');
  }
  get event() {
    return this.formData.get('event');
  }
  get isActive() {
    return this.formData.get('isActive');
  }
}
