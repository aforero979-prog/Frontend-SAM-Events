import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";

import { Header } from "./shared/components/header/header";
import { Footer } from './shared/components/footer/footer';
import { Person } from './interfaces/person';
import { person } from './data/data';

 
@Component({
  selector: 'app-root',
  imports: [Header, Footer ,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Front-SAM-Events');

    
    // One Way Data Binding
    // Interpolacion (Angular {{}} ) != (J avaScript ${} )
    // Two Way Data Binding


    public name: string = 'Juan'   // Asigna valor con defincion incial de tipo de dato
    lastName = 'Jiménez'           // Asigna valor por inferencia de tipo de dato
    private age: number = 48       // Asigna valor con defincion incial de tipo de dato
    
    person: Person = person

    eventos: string[] = [ 'Marco Carola', 'Maceo Plex', 'Carl Cox']
  }