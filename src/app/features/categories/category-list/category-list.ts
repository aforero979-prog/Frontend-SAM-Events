import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { HttpCategory } from '../../../core/services/http-category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { HugeiconsIconComponent } from '@hugeicons/angular'
import { Notification03Icon, ToggleOnIcon } from '@hugeicons/core-free-icons'

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, AsyncPipe, JsonPipe,HugeiconsIconComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})


export default class CategoryList {

  categoryList$ = new BehaviorSubject<any>([])

  //Define atributo público qye desplegará el ícono
  notificationIcon = Notification03Icon
  notificationIcon1 = ToggleOnIcon


  //Siempre inyectar la dependencia 
  private httpCategory = inject( HttpCategory )

  //Hook del ciclo de vida: Reconoce cuando se inicializa el componente

  ngOnInit() { 
   //Obtener el listado de categorias usando el servicio
   this.httpCategory.getCategories().subscribe({
    next: ( data ) => {
      console.log( data.data )
      this.categoryList$.next(data.data)  //Esta linea guarda los datos dentro de un observable creado por el behaviorsubject
    },
    error: ( err ) => {
      console.error( err ) 
    },
    complete: () => {
      console.log( 'Lista de categorias:' )
    }
   })
  }
}
