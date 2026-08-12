import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HttpCart {
    private http = inject(HttpClient);

    // obtener todos los carritos
    getCarts() {
        return this.http.get(`${environment.apiUrl}/carts`);
    }

    // obtener un carrito por id
    getCartById(id: string) {
        return this.http.get(`${environment.apiUrl}/carts/${id}`);
    }

    // crear un nuevo carrito
    createCart(cart: any) {
        return this.http.post(`${environment.apiUrl}/carts`, cart);
    }

    // actualizar un carrito
    updateCart(id: string, cart: any) {
        return this.http.patch(`${environment.apiUrl}/carts/${id}`, cart);
    }

    // eliminar un carrito
    deleteCart(id: string) {
        return this.http.delete(`${environment.apiUrl}/carts/${id}`);
    }
}
