import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpEvents } from '../../../core/services/http-events';
import { HttpAuth } from '../../../core/services/http-auth';
import { CartStateService } from '../../../core/services/cart-state.service';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  imports: [ AsyncPipe, RouterLink, ReactiveFormsModule, CurrencyPipe ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export default class EventDetails implements OnInit {
  private activatedRoute = inject( ActivatedRoute );
  private httpEvents = inject( HttpEvents );
  private httpAuth = inject( HttpAuth );
  private cartState = inject( CartStateService );
  private router = inject( Router );

  event$ = new BehaviorSubject<any>(null);
  selectedId!: string | null;
  formData!: FormGroup;

  successMsg = '';
  errorMsg = '';

  zones = ['General', 'VIP', 'BackStage', 'Palco'];
  quantities = [1, 2, 3, 4]; // Máximo 4 boletas

  zonePrices: Record<string, number> = {
    'General': 80000,
    'VIP': 150000,
    'BackStage': 250000,
    'Palco': 200000
  };

  constructor() {
    this.formData = new FormGroup({
      zone: new FormControl('General', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4)]),
    });
  }

  ngOnInit() {
    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.selectedId) {
      this.httpEvents.getEventById(this.selectedId).subscribe({
        next: (res) => {
          this.event$.next(res.data);
        },
        error: (err) => {
          console.error(err);
        },
      });
    }
  }

  getUnitPrice(): number {
    const zone = this.formData.get('zone')?.value || 'General';
    const event = this.event$.getValue();
    if (event?.price) {
      return event.price;
    }
    return this.zonePrices[zone] || 80000;
  }

  getSubtotal(): number {
    return this.getUnitPrice() * (this.formData.get('quantity')?.value || 1);
  }

  getAvailableCapacity(): number {
    const event = this.event$.getValue();
    if (!event) return 0;
    return event.capacity || event.availableTickets || 0;
  }

  addToCart() {
    if (this.formData.invalid) {
      this.errorMsg = 'Selecciona una zona y cantidad válida.';
      return;
    }

    const user = this.httpAuth.getCurrentUser();
    if (!user?._id) {
      // Redirigir a login-required si no está autenticado
      this.router.navigateByUrl('/login-required');
      return;
    }

    const event = this.event$.getValue();
    if (!event) return;

    const quantity = this.formData.get('quantity')?.value || 1;
    const capacity = this.getAvailableCapacity();

    if (capacity > 0 && quantity > capacity) {
      this.errorMsg = `Solo quedan ${capacity} boletas disponibles`;
      return;
    }

    this.cartState.addItem({
      eventId: event._id,
      eventName: event.name,
      eventImageUrl: event.imageUrl || '',
      zone: this.formData.get('zone')?.value,
      quantity: quantity,
      unitPrice: this.getUnitPrice()
    });

    this.successMsg = `¡${quantity} boleta(s) agregadas al carrito!`;
    this.errorMsg = '';
    this.formData.patchValue({ quantity: 1 });
  }

  goToCart() {
    this.router.navigateByUrl('/cart');
  }
}
