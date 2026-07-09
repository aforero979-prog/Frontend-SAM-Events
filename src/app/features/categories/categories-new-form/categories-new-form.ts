import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpCategory } from '../../../core/services/http-category';


@Component({
  selector: 'app-categories-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './categories-new-form.html',
  styleUrl: './categories-new-form.css',
})
export class CategoriesNewForm  {

  private httpCategory = inject( HttpCategory)

  formData: FormGroup;

  constructor() {

    this.formData = new FormGroup({
      //Define la estructura equivalente del formulario
      name: new FormControl(),
      description: new FormControl(),
      status: new FormControl()
    })
  }

  onEnviar() {

    if(this.formData.valid) {
      console.log(this.formData.value)
      this.httpCategory.createCategories(this.formData.value).subscribe({
        next:(res) => {
          console.log(res)
        },
        error: (error) => {console.error(error)},
        complete: () => {console.log('complete execute')}
      })
    } else {
      console.log('El formulario no es valido')
    }
  }


}
