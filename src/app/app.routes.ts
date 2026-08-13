import { Routes } from '@angular/router';

import Home from './features/home/home';
import PageNotFound from './features/page-not-found/page-not-found';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./features/home/home') },

  { path: '404', loadComponent: () => import('./features/page-not-found/page-not-found') },

  { path: 'login', loadComponent: () => import('./features/login/login') },
  { path: 'register', loadComponent: () => import('./features/register/register') },
  { path: 'photon', loadComponent: () => import('./features/photon/photon') },
  { path: 'mindagainst', loadComponent: () => import('./features/mindagainst/mindagainst') },
  { path: 'bar/home', loadComponent: () => import('./features/bars/bar-home/bar-home') },
  // ── Dashboard Admin (con child routes) ──────────
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard'),
    children: [
      { path: 'users', loadComponent: () => import('./features/users/user-list/user-list') },
      { path: 'users/new', loadComponent: () => import('./features/users/user-new-form/user-new-form') },
      { path: 'events', loadComponent: () => import('./features/eventos/event-list/event-list') },
      { path: 'events/new', loadComponent: () => import('./features/events/event-new-form/event-new-form') },
      { path: 'bars', loadComponent: () => import('./features/bars/bar-list/bar-list') },
      { path: 'bars/new/:id', loadComponent: () => import('./features/bars/bar-new-form/bar-new-form') },
      { path: 'bar/edit/:id', loadComponent: () => import('./features/bars/bar-edit-form/bar-edit-form') },
      { path: 'carts', loadComponent: () => import('./features/cart/cart-list/cart-list') },
      { path: 'carts/new', loadComponent: () => import('./features/cart/cart-new-form/cart-new-form') },
      // Rutas existentes que se mantienen como child routes del dashboard
      { path: 'user-new-form', loadComponent: () => import('./features/users/user-new-form/user-new-form') },
      { path: 'location-new-form', loadComponent: () => import('./features/location/location-new-form/location-new-form') },
      { path: 'category/new', loadComponent: () => import('./features/categories/category-new-form/category-new-form') },
      { path: 'category/edit/:id', loadComponent: () => import('./features/categories/category-edit-form/category-edit-form') },
      { path: 'category/list', loadComponent: () => import('./features/categories/category-list/category-list') },
      { path: 'event/new', loadComponent: () => import('./features/events/event-new-form/event-new-form') },
      { path: 'post/new', loadComponent: () => import('./features/posts/post-new-form/post-new-form') },
      { path: 'post/list', loadComponent: () => import('./features/posts/post-list/post-list') },
      { path: 'post/edit/:id', loadComponent: () => import('./features/posts/post-edit-form/post-edit-form') },
      { path: 'gateway/new', loadComponent: () => import('./features/gateways/gateway-new-form/gateway-new-form') },
      { path: 'cart/new', loadComponent: () => import('./features/cart/cart-new-form/cart-new-form') },
    ]
  },
  { path: 'events', loadComponent: () => import('./features/events/event-list/event-list') },
  {
    path: 'events-details',
    loadComponent: () => import('./features/events/event-details/event-details'),
  },

  // ──  Bares  ──────────────────────────────────────

  { path: 'club-new', loadComponent: () => import('./features/bares/bar-new-form/bar-new-form')},
  
  // ── Tickets ──────────────────────────────────────

  { path: 'buy-ticket', loadComponent: () => import('./features/ticket/ticket-new-form') },



  { path: '404', component: PageNotFound },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
