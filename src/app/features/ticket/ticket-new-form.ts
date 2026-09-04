import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpEvents } from '../../core/services/http-events';
import { HttpAuth } from '../../core/services/http-auth';
import { CartStateService } from '../../core/services/cart-state.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-ticket-new-form',
  imports: [ReactiveFormsModule, AsyncPipe, CurrencyPipe],
  templateUrl: './ticket-new-form.html',
  styleUrl: './ticket-new-form.css'
})
export default class TicketNewForm implements OnInit {

  private httpEvents = inject(HttpEvents);
  private httpAuth = inject(HttpAuth);
  private cartState = inject(CartStateService);
  private router = inject(Router);

  events$ = new BehaviorSubject<any[]>([]);
  selectedEvent: any = null;
  formData: FormGroup;
  successMsg = '';
  errorMsg = '';

  zones = ['General', 'VIP', 'BackStage', 'Palco'];
  quantities = [1, 2, 3, 4];

  // Precios por zona (estos se podrían configurar por evento)
  zonePrices: Record<string, number> = {
    'General': 80000,
    'VIP': 150000,
    'BackStage': 250000,
    'Palco': 200000
  };

  constructor() {
    this.formData = new FormGroup({
      eventId:  new FormControl('', [Validators.required]),
      zone:     new FormControl('General', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4)]),
    });
  }

  ngOnInit() {
    // Cargar eventos disponibles
    this.httpEvents.getEvents().subscribe({
      next: (events) => {
        this.events$.next(Array.isArray(events) ? events : []);
      },
      error: (err) => console.error('Error cargando eventos:', err)
    });

    // Escuchar cambios en el evento seleccionado
    this.formData.get('eventId')?.valueChanges.subscribe((eventId) => {
      const events = this.events$.getValue();
      this.selectedEvent = events.find(e => e._id === eventId) || null;
    });
  }

  getUnitPrice(): number {
    const zone = this.formData.get('zone')?.value || 'General';
    // Si el evento tiene precio, usarlo; sino usar el precio por zona
    if (this.selectedEvent?.price) {
      return this.selectedEvent.price;
    }
    return this.zonePrices[zone] || 80000;
  }

  getSubtotal(): number {
    return this.getUnitPrice() * (this.formData.get('quantity')?.value || 1);
  }

  getAvailableCapacity(): number {
    if (!this.selectedEvent) return 0;
    return this.selectedEvent.capacity || this.selectedEvent.availableTickets || 0;
  }

  addToCart() {
    if (this.formData.invalid || !this.selectedEvent) {
      this.errorMsg = 'Selecciona un evento y zona válidos';
      return;
    }

    const user = this.httpAuth.getCurrentUser();
    if (!user?._id) {
      this.errorMsg = 'Debes iniciar sesión para comprar boletas';
      this.router.navigateByUrl('/login');
      return;
    }

    const quantity = this.formData.get('quantity')?.value || 1;
    const capacity = this.getAvailableCapacity();

    if (capacity > 0 && quantity > capacity) {
      this.errorMsg = `Solo quedan ${capacity} boletas disponibles`;
      return;
    }

    this.cartState.addItem({
      eventId: this.selectedEvent._id,
      eventName: this.selectedEvent.name,
      eventImageUrl: this.selectedEvent.imageUrl || '',
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