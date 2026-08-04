import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';

@Component({
  selector: 'app-category-edit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-edit-form.html',
  styleUrl: './category-edit-form.css',
})
export default class CategoryEditForm {
  selectedId!: string | null//Atributo donde vamos a almacenar el ID del documento que vamos a editar
  formData!: FormGroup;
  private activatedRoute = inject( ActivatedRoute )
  private httpCategory = inject( HttpCategory )
  private router = inject( Router )

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      status: new FormControl(true),
    });
  }

  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get( 'id' )
  
    // console.log(this.selectedId)

    //Va a consultar si el documento existe y lo traemos por su ID
    this.httpCategory.getCategoryById( this.selectedId ).subscribe({
      next: ( data ) => {
        console.log( data.data )

        const { name, description, status } = data.data

        //Actualizamos los valores de los campos del formulario
        this.formData.patchValue({
          name: name,
          description: description,
          status: status
        })
      },
      error: ( err ) => {
        console.error( err )
      },
      complete: () => {
        console.log( 'Categoria obteniada por ID con éxito' )
      }
    })
  }

  onSubmit() {
    if ( this.formData.valid ) {
      console.log( this.formData.value)
      this.httpCategory.updateCategoryById( this.selectedId, this.formData.value).subscribe({
        next: ( data ) => {
          console.log( data )
          this.router.navigateByUrl( '/category/list' )
        },
        error: ( err ) => {
          console.error( err )
        },
        complete: () => {
          console.log( 'Categoria editadda correctamente' )
        }
      })
    } else {
      console.log( 'El formulario no es válido' );
    }
  }

    get name() {
    return this.formData.get( 'name' )
  }
}
