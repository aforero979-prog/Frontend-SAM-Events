import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HttpUser } from '../../../core/services/http-user';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export default class UserList implements OnInit {
  subscribeUsers!: Subscription;
  subscribeDeleteUser!: Subscription;
  public userList$ = new BehaviorSubject<any[]>([]);

  // Inyectar el servicio
  private httpUser = inject(HttpUser);
  private router = inject(Router);

  // Hook: saber cuando se inicializa el componente
  ngOnInit() {
    this.loadUsers();
  }

  ngOnDestroy() {
    // Verifico si existe una subscripción activa y la cancelo para evitar fugas de memoria
    if (this.subscribeUsers) {
      this.subscribeUsers.unsubscribe();
    }
    if (this.subscribeDeleteUser) {
      this.subscribeDeleteUser.unsubscribe();
    }
  }

  private loadUsers() {
    // Cancela suscripción anterior si existe
    if (this.subscribeUsers) {
      this.subscribeUsers.unsubscribe();
    }
    // Guarda la subscripcion para tener control de la misma y poder cancelarla en el ngOnDestroy
    this.subscribeUsers = this.httpUser.getUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.userList$.next(data);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => { console.log('Lista de todos los usuarios'); },
    });
  }

  onEdit(id: string) {
    console.log('Editando usuario con id:', id);
    this.router.navigate(['/user-edit-form', id]);
  }

  onDelete(id: string) {
    console.log('Intentando eliminar usuario con id:', id);
    if (!id) {
      console.error('El id es undefined o vacío, no se puede eliminar');
      return;
    }
    this.subscribeDeleteUser = this.httpUser.deleteUser(id).subscribe({
      next: (data) => {
        console.log('Usuario eliminado:', data);
        this.loadUsers(); // Recargar la lista de usuarios después de eliminar uno
      },
      error: (err) => { console.error('Error al eliminar:', err); },
      complete: () => { console.log('Petición de borrado completada'); },
    });
  }
}