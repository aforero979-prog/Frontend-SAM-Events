import { Routes } from '@angular/router';
import Home from './features/home/home';
import Eventos from './features/eventos/eventos';
import Register from './features/register/register';
import Login from './features/login/login';
import Checkout from './features/checkout/checkout';
import PageNotFound from './features/page-not-found/page-not-found';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'user-new-form', loadComponent: () => import('./features/users/user-new-form/user-new-form') },
  { path: 'user-list', loadComponent: () => import('./features/users/user-list/user-list') },
  { path: 'user-edit-form/:id', loadComponent: () => import('./features/users/user-edit-form/user-edit-form') },
  { path: 'post-new-form', loadComponent: () => import('./features/posts/post-new-form/post-new-form') },
  { path: 'gateway-new-form', loadComponent: () => import('./features/gateways/gateway-new-form/gateway-new-form') },
  { path: 'ticket-new', loadComponent: () => import('./features/ticket/ticket-new-form') },
  {
    path: 'location-new-form',
    loadComponent: () =>
      import('./features/location/location-new-form/location-new-form').then(
        (m) => m.LocationNewForm,
      ),
  },
  { path: 'eventos', component: Eventos },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'checkout', component: Checkout },
  { path: '404', component: PageNotFound },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
