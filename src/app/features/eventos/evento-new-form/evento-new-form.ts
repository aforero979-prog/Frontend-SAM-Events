import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';

@Component({
  selector: 'app-evento-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './evento-new-form.html',
  styleUrl: './evento-new-form.css',
})
export class EventoNewForm {

  private httpCategory = inject( HttpCategory )

  //Atributo de la calse que va a contener al formulario
  formData: FormGroup

  constructor () {
    this.formData = new FormGroup({
      name: new FormControl( '', [Validators.required, Validators.minLength(5)] ),
      description: new FormControl( '', [Validators.required] ),
      price: new FormControl( 0, [Validators.required, Validators.min(0)] ),
      stock: new FormControl( 1, [Validators.required, Validators.min(1)]),
      status: new FormControl(true, [Validators.required]),
      category: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {

    if(this.formData.valid) {
      console.log( this.formData.value )
    } else {
      console.log('El formulario no es valido')
    }
  }

  //Hook: Cclo de vida que sabe cuando se inicializa el componente

  ngOnInit() {
    this.httpCategory.getCategories().subscribe({
      next: (data) => {
        console.log(data)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {}
    })
  }

}
