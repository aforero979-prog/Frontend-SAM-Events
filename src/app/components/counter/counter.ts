import { Component } from "@angular/core";

// Decorador para definir un componente
@Component({
  selector: 'kounter',
  templateUrl: './counter.html',
  styleUrls: ['./counter.css', './counter-titles.css']
})


export class Counter {
    counter: number 

    constructor() { 
        console.log('Counter')
        this.counter = 0;
    }
    
    increment() {
        this.counter++
    }
    decrement() {
        this.counter--
    }
    reset() {
        this.counter = 0
    }

}