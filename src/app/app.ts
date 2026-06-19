import { Component, signal } from '@angular/core';
import { Header } from "./shared/components/header/header";
import { RouterOutlet } from "@angular/router";
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [Header, Footer ,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Front-SAM-Events');
}
