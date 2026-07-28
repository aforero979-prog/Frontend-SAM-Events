import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpTicket } from '../../core/services/http-ticket';


@Component({
  selector: 'app-ticket-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './ticket-new-form.html',
  styleUrl: './ticket-new-form.css'
})
export default class TicketNewForm {

    private httpTicket = inject( HttpTicket )
    

  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl(''),
      lastname: new FormControl(''),
      email: new FormControl(''),
      stock: new FormControl(''),
      localidad: new FormControl(''),
      cedula: new FormControl('')
    });
  }

  onSubmit() {

    if(this.formData.valid) {
      console.log( this.formData.value)
      this.httpTicket.createTicket(this.formData.value).subscribe({
        next: ( res ) => {
          console.log(res)
        },
        error: ( error ) => {
          console.error (error )},
        complete: () => {
          console.log('complete execute')}
      })
    } else {
      console.log('El formulario no es valido')
    }   
  }

}