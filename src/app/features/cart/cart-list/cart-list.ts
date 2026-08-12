import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpCart } from '../../../core/services/http-cart';

@Component({
  selector: 'app-cart-list',
  imports: [RouterLink],
  templateUrl: './cart-list.html',
  styleUrl: './cart-list.css',
})
export default class CartList implements OnInit {
  private httpCart = inject(HttpCart);
  carts: any[] = [];

  showDeleteModal = false;
  showSuccessModal = false;
  private pendingDeleteId = '';

  ngOnInit() {
    this.loadCarts();
  }

  loadCarts() {
    this.httpCart.getCarts().subscribe({
      next: (res: any) => {
        const d = res?.data || res;
        this.carts = Array.isArray(d) ? d : [];
      },
      error: (err) => console.error('Error cargando carritos', err),
    });
  }

  onDelete(id: string) {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.showDeleteModal = false;
    if (!this.pendingDeleteId) return;
    this.httpCart.deleteCart(this.pendingDeleteId).subscribe({
      next: () => {
        this.loadCarts();
        this.showSuccessModal = true;
        setTimeout(() => this.showSuccessModal = false, 3000);
      },
      error: (err) => console.error('Error eliminando carrito', err),
    });
    this.pendingDeleteId = '';
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.pendingDeleteId = '';
  }
}
