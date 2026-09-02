import { Component, inject } from '@angular/core';
import { CartStateService, CartItem } from '../../core/services/cart-state.service';
import { HttpCart } from '../../core/services/http-cart';
import { HttpTicket } from '../../core/services/http-ticket';
import { HttpAuth } from '../../core/services/http-auth';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css',
})
export default class ShoppingCart {
  cartState = inject(CartStateService);
  private httpCart = inject(HttpCart);
  private httpTicket = inject(HttpTicket);
  private httpAuth = inject(HttpAuth);
  private router = inject(Router);

  items$ = this.cartState.items$;
  successMsg = '';
  errorMsg = '';
  isProcessing = false;

  removeItem(index: number) {
    this.cartState.removeItem(index);
  }

  updateQty(index: number, event: Event) {
    const qty = +(event.target as HTMLInputElement).value;
    if (qty > 0) {
      this.cartState.updateQuantity(index, qty);
    }
  }

  getTotal(): number {
    return this.cartState.getTotal();
  }

  checkout() {
    const user = this.httpAuth.getCurrentUser();
    if (!user?._id) {
      this.errorMsg = 'Debes iniciar sesión para comprar';
      this.router.navigateByUrl('/login');
      return;
    }

    const items = this.cartState.getItems();
    if (items.length === 0) {
      this.errorMsg = 'El carrito está vacío';
      return;
    }

    this.isProcessing = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Crear el carrito en el backend
    const cartPayload = {
      userId: user._id,
      items: items.map(i => ({
        eventId: i.eventId,
        zone: i.zone,
        quantity: i.quantity,
        unitPrice: i.unitPrice
      })),
      totalPrice: this.getTotal(),
      status: 'completed'
    };

    this.httpCart.createCart(cartPayload).subscribe({
      next: () => {
        // Crear tickets individuales por cada item
        const ticketPromises = items.map(item => {
          const ticketData = {
            name: item.zone,
            price: item.unitPrice,
            description: `Ticket ${item.zone} - ${item.eventName}`,
            status: 'Comprada',
            stock: item.quantity,
            eventId: item.eventId,
            userId: user._id,
            quantity: item.quantity,
            zone: item.zone,
            totalPrice: item.unitPrice * item.quantity
          };
          return this.httpTicket.createTicket(ticketData).subscribe({
            error: (err) => console.error('Error creando ticket:', err)
          });
        });

        this.cartState.clearCart();
        this.successMsg = '¡Compra realizada con éxito! Tus boletas han sido registradas.';
        this.isProcessing = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.msg || 'Error al procesar la compra';
        this.isProcessing = false;
      }
    });
  }
}
