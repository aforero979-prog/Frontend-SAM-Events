import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  eventId: string;
  eventName: string;
  eventImageUrl: string;
  zone: string;
  quantity: number;
  unitPrice: number;
}

@Injectable({ providedIn: 'root' })
export class CartStateService {

  private readonly STORAGE_KEY = 'sam_cart';
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  items$ = this.itemsSubject.asObservable();
  itemCount = signal(0);

  constructor() {
    this.updateCount();
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private updateCount() {
    const items = this.itemsSubject.getValue();
    this.itemCount.set(items.reduce((sum, i) => sum + i.quantity, 0));
  }

  getItems(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  addItem(item: CartItem) {
    const items = [...this.getItems()];
    // Si ya existe un item con el mismo evento y zona, sumar cantidad
    const existingIndex = items.findIndex(
      i => i.eventId === item.eventId && i.zone === item.zone
    );
    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        quantity: items[existingIndex].quantity + item.quantity
      };
    } else {
      items.push(item);
    }
    this.itemsSubject.next(items);
    this.saveToStorage(items);
    this.updateCount();
  }

  removeItem(index: number) {
    const items = [...this.getItems()];
    items.splice(index, 1);
    this.itemsSubject.next(items);
    this.saveToStorage(items);
    this.updateCount();
  }

  updateQuantity(index: number, quantity: number) {
    const items = [...this.getItems()];
    if (items[index]) {
      items[index] = { ...items[index], quantity };
      this.itemsSubject.next(items);
      this.saveToStorage(items);
      this.updateCount();
    }
  }

  clearCart() {
    this.itemsSubject.next([]);
    this.saveToStorage([]);
    this.updateCount();
  }

  getTotal(): number {
    return this.getItems().reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  }
}
