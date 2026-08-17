import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpSupport } from '../../../core/services/http-support';

@Component({
  selector: 'app-refunds',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './refunds.html',
  styleUrl: './refunds.css'
})
export default class RefundsComponent {
  private httpSupport = inject(HttpSupport);

  refundForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('Solicitud de Reembolso', [Validators.required]),
    transactionId: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    requestType: new FormControl('Refund')
  });

  successMsg = '';
  errorMsg = '';

  onSubmit() {
    if (this.refundForm.valid) {
      // In a real scenario, we might want to map transactionId into the message or backend model directly
      // Since we will update the backend SupportModel to include transactionId, we can pass it as is.
      this.httpSupport.createTicket(this.refundForm.value).subscribe({
        next: () => {
          this.successMsg = 'Tu solicitud de reembolso ha sido enviada con éxito. Estudiaremos tu caso y te contactaremos.';
          this.errorMsg = '';
          this.refundForm.reset({ requestType: 'Refund', subject: 'Solicitud de Reembolso' });
        },
        error: (err: any) => {
          this.errorMsg = err.error?.msg || 'Ocurrió un error al enviar la solicitud.';
          this.successMsg = '';
        }
      });
    }
  }
}
