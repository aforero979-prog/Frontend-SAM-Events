import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';

// Interceptor funcional: agrega el token X-Token a todas las peticiones HTTP
// El backend espera el header X-Token con el JWT para rutas protegidas
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Leer el token guardado en localStorage tras el login
  const router = inject(Router);
  const token = localStorage.getItem('token');
  let request = req;

  // No enviar el token en las rutas de login y registro
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (token && !isAuthRoute) {
    // Clonar la petición y agregar el header X-Token
    request = req.clone({
      headers: req.headers.set('X-Token', token)
    });
  }

  // Continuar con la petición y manejar errores globalmente
  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      // Si el error es 401 (No autorizado) y NO estamos en la ruta de login
      if (err.status === 401 && !req.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigateByUrl('/home');
      }
      throw err;
    })
  );
};
