import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpGateway } from '../../../core/services/http-gateway';

// proveedores y estados definidos en el backend
const PROVIDERS  = ['stripe', 'paypal', 'mercadopago', 'wompi', 'epayco', 'other'];
const STATUSES   = ['pending', 'approved', 'rejected', 'cancelled', 'refunded'];

@Component({
  selector: 'app-gateway-new-form',
  imports: [ReactiveFormsModule],
  templateUrl: './gateway-new-form.html',
  styleUrl: './gateway-new-form.css',
})
export default class GatewayNewForm {

  private httpGateway = inject(HttpGateway);

  // listas para los selects
  providers = PROVIDERS;
  statuses  = STATUSES;

  // atributo de la clase que va a contener el formulario
  formData: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name:          new FormControl('', [Validators.required]),
      provider:      new FormControl('', [Validators.required]),
      transactionId: new FormControl(''),
      amount:        new FormControl(0, [Validators.required, Validators.min(0)]),
      currency:      new FormControl('COP'),
      status:        new FormControl('pending', [Validators.required]),
      user:          new FormControl('', [Validators.required]),
      ticket:        new FormControl('', [Validators.required]),
      isActive:      new FormControl(true),
    });
  }

  onSubmit() {
    if (this.formData.valid) {
      console.log(this.formData.value);

      this.httpGateway.createGateway(this.formData.value).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => { console.error(error); },
        complete: () => { console.log('complete execute'); }
      });
    } else {
      console.log('El formulario no es valido');
    }
  }
}
