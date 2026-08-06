import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpCategory } from '../../../core/services/http-category';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { HugeiconsIconComponent } from '@hugeicons/angular';
import { ToggleOffIcon, ToggleOnIcon } from '@hugeicons/core-free-icons';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, AsyncPipe, HugeiconsIconComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export default class CategoryList {
  categoryList$ = new BehaviorSubject<any>([]);

  //Define atributo público qye desplegará el ícono

  notificationIcon1 = ToggleOnIcon;
  notificationIcon2 = ToggleOffIcon;

  //Siempre inyectar la dependencia
  private httpCategory = inject( HttpCategory );
  private router = inject ( Router)

  //Hook del ciclo de vida: Reconoce cuando se inicializa el componente

  ngOnInit() {
    this.onLoadData();
  }

  onEdit(id: string) {
    console.log('Editar', id)
    this.router.navigateByUrl( `/dashboard/category/edit/${id}` ) //Hacer una redirección enviando el ID por la ruta

  }

  onDelete(id: string) {
    console.log('Eliminar', id);
    this.httpCategory.deleteCategoryById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.onLoadData();
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Ha sido eliminado correctamente');
      },
    });
  }

  onLoadData() {
    //Obtener el listado de categorias usando el servicio
    this.httpCategory.getCategories().subscribe({
      next: (data) => {
        console.log(data.data);
        this.categoryList$.next(data.data); //Esta linea guarda los datos dentro de un observable creado por el behaviorsubject
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Lista de categorias:');
      },
    });
  }
}
