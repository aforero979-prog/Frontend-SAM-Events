import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpSupport } from '../../../core/services/http-support';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './terms.html',
  styleUrl: './terms.css'
})
export default class TermsComponent {
  // Asumimos que HttpSupport existirá
  private httpSupport = inject(HttpSupport);

  supportForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    subject: new FormControl('Consulta sobre Términos y Condiciones', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    requestType: new FormControl('Terms')
  });

  successMsg = '';
  errorMsg = '';

  onSubmit() {
    if (this.supportForm.valid) {
      this.httpSupport.createTicket(this.supportForm.value).subscribe({
        next: () => {
          this.successMsg = 'Tu consulta ha sido enviada correctamente. Te responderemos pronto.';
          this.errorMsg = '';
          this.supportForm.reset({ requestType: 'Terms', subject: 'Consulta sobre Términos y Condiciones' });
        },
        error: (err: any) => {
          this.errorMsg = err.error?.msg || 'Ocurrió un error al enviar la consulta.';
          this.successMsg = '';
        }
      });
    }
  }
}
