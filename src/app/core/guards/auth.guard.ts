import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    // Si no está autenticado, redirigir a la página intermedia que solicita login
    router.navigateByUrl('/login-required');
    return false;
  }

  return true;
};
