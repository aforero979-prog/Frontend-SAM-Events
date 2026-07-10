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
      price: new FormControl(0),
      description: new FormControl(''),
      status: new FormControl(true),
      stock: new FormControl(0)
    });
  }

  onSubmit() {

    if(this.formData.valid) {
      console.log( this.formData.value)
      this.httpTicket.createTicket(this.formData.value).subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (error) => {console.error(error)},
        complete: () => {console.log('complete execute')}
      })
    } else {
      console.log('El formulario no es valido')
    }   
  }

  // ngOnInit() {
  //   this.httpTicket.createTicket(this.formData.value).subscribe({
  //     next: (data) => {
  //       console.log(data)
  //     },
  //     error: (err) => {
  //       console.error(err)
  //     },
  //     complete: () => {}
  //   })
  // }

}