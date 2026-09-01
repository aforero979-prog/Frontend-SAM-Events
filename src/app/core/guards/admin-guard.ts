import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    router.navigateByUrl('/login');
    return false;
  }

  try {
    const user = JSON.parse(userRaw);
    if (user?.role === 'ADMIN') {
      return true;
    }
  } catch {}

  router.navigateByUrl('/home');
  return false;
};
