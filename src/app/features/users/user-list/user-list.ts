import { Component, inject } from '@angular/core';
import { HttpUsers } from '../../../core/services/http-users';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [JsonPipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {

  users: any = {}

  //Inyectar una dependencia
  private httpUsers = inject( HttpUsers );

  //Hook del ciclo de vida de un componente de angular (cuando se inicializa un componente)
  ngOnInit() {
    //Invocando la funcionalidad del servicio - Obtiene todos los usuiarios
    this.httpUsers.getUsers().subscribe({
      next: ( data ) => {
        console.log( data )
        this.users = data     //Asignando los datos obtenidos del servicio al aributo publico para mostrarlo en el html
      },
      error: ( error ) => {
        console.error( error )
      },
      complete: () => {}
    });
  }
}
