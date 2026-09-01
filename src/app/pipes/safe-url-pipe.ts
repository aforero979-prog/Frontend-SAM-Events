import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true // Asegura que sea standalone si usas Angular 14+
})
export class SafeUrlPipe implements PipeTransform {

  // Inyectamos el servicio de Angular en el constructor
  constructor(private sanitizer: DomSanitizer) {}

  // El método transform recibe tu URL y devuelve una URL segura
  transform(url: string): SafeResourceUrl | null {
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}