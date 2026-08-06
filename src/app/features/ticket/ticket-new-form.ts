import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
  successMsg = '';
  errorMsg = '';

  // estados válidos según el modelo del backend
  statuses = ['Disponible', 'Comprada', 'Cancelada', 'agotada', 'Pendiente'];

  constructor() {
    this.formData = new FormGroup({
      name:        new FormControl('', [Validators.required]),
      price:       new FormControl(0, [Validators.min(0)]),
      description: new FormControl('', [Validators.required]),
      status:      new FormControl('Disponible'),
      stock:       new FormControl(1, [Validators.min(1)])
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      this.httpTicket.createTicket(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
          this.successMsg = 'Ticket creado correctamente';
          this.errorMsg = '';
          this.formData.reset({ status: 'Disponible', stock: 1, price: 0 });
        },
        error: (error) => {
          console.error(error);
          this.errorMsg = error.error?.msg || 'Error al crear el ticket';
          this.successMsg = '';
        },
        complete: () => { console.log('complete'); }
      });
    } else {
      console.log('El formulario no es válido');
    }
  }
}