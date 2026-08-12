import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpCart } from '../../../core/services/http-cart';

@Component({
    selector: 'app-cart-new-form',
    imports: [ReactiveFormsModule],
    templateUrl: './cart-new-form.html',
    styleUrl: './cart-new-form.css'
})
export default class CartNewForm {
    private httpCart = inject(HttpCart);

    // atributo de la clase que va a contener el formulario
    formData: FormGroup;

    constructor() {
        this.formData = new FormGroup({
            userId: new FormControl('', [Validators.required]),
            items: new FormArray([]) // array dinámico para los items
        });

        // agregar un item inicial vacío
        this.addItem();
    }

    get items(): FormArray {
        return this.formData.get('items') as FormArray;
    }

    createItem(): FormGroup {
        return new FormGroup({
            productId: new FormControl('', [Validators.required]),
            quantity: new FormControl(1, [Validators.required, Validators.min(1)])
        });
    }

    addItem() {
        this.items.push(this.createItem());
    }

    // eliminar un item del carrito
    removeItem(index: number) {
        if (this.items.length > 1) { // mantiene por lo menos 1 item
            this.items.removeAt(index);
        }
    }

    onSubmit() {
        if (this.formData.invalid) {
            return;
        }
        console.log(this.formData.value);
        this.httpCart.createCart(this.formData.value).subscribe({
            next: (res) => {
                console.log(res);
            },
            error: (error) => {
                console.log('Error creating cart', error);
            }
        });
    }
}
