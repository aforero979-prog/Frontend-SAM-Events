import { Routes } from '@angular/router';

import Home from './features/home/home';
import PageNotFound from './features/page-not-found/page-not-found';

export const routes: Routes = [
  // ── 1. Redirección inicial ──────────────────────────────────────
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ── 2. Rutas Públicas / Principales ──────────────────────────────
  { path: 'home', loadComponent: () => import('./features/home/home') },
  { path: 'login', loadComponent: () => import('./features/login/login') },
  { path: 'register', loadComponent: () => import('./features/register/register') },

  // Eventos públicos
  { path: 'events', loadComponent: () => import('./features/events/event-list/event-list') },
  { path: 'event-details', loadComponent: () => import('./features/events/event-details/event-details') },
  { path: 'event/home', loadComponent: () => import('./features/events/event-home/event-home') },
  { path: 'event-info/:id', loadComponent: () => import('./features/events/event-info/event-info')},

  // Bares públicos
  { path: 'bar/home', loadComponent: () => import('./features/bars/bar-home/bar-home') },
  { path: 'club-new', loadComponent: () => import('./features/bars/bar-new-form/bar-new-form') },

  // Tickets
  { path: 'buy-ticket', loadComponent: () => import('./features/ticket/ticket-new-form') },

  // Bares y Posts públicos
  { path: 'bares', loadComponent: () => import('./features/bars/bar-home/bar-home') },
  { path: 'posts', loadComponent: () => import('./features/posts/post-public-list/post-public-list') },

  // Legal y Soporte
  { path: 'terminos', loadComponent: () => import('./features/support/terms/terms') },
  { path: 'reembolsos', loadComponent: () => import('./features/support/refunds/refunds') },

  { path: 'bar/home', loadComponent: () => import('./features/bars/bar-home/bar-home') },


  
  // ── 3. Panel de Administración (Dashboard) ──────────────────────
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard'),
    children: [
      // Usuarios
      { path: 'users', loadComponent: () => import('./features/users/user-list/user-list') },
      { path: 'user/new', loadComponent: () => import('./features/users/user-new-form/user-new-form') },
      { path: 'user/edit/:id', loadComponent: () => import('./features/users/user-edit-form/user-edit-form') },

      // Eventos
      { path: 'events', loadComponent: () => import('./features/eventos/event-list/event-list') },
      { path: 'event/new', loadComponent: () => import('./features/events/event-new-form/event-new-form') },
      { path: 'event/edit/:id', loadComponent: () => import('./features/events/event-new-form/event-new-form') },

      // Bares
      { path: 'bars', loadComponent: () => import('./features/bars/bar-list/bar-list') },
      { path: 'bar/new', loadComponent: () => import('./features/bars/bar-new-form/bar-new-form') },
      { path: 'bar/edit/:id', loadComponent: () => import('./features/bars/bar-edit-form/bar-edit-form') },

      // Categorías
      { path: 'categories', loadComponent: () => import('./features/categories/category-list/category-list') },
      { path: 'category/new', loadComponent: () => import('./features/categories/category-new-form/category-new-form') },
      { path: 'category/edit/:id', loadComponent: () => import('./features/categories/category-edit-form/category-edit-form') },

      // Publicaciones (Posts)
      { path: 'posts', loadComponent: () => import('./features/posts/post-list/post-list') },

      { path: 'post/new', loadComponent: () => import('./features/posts/post-new-form/post-new-form') },
      { path: 'post/edit/:id', loadComponent: () => import('./features/posts/post-edit-form/post-edit-form') },

      // Música
      { path: 'music', loadComponent: () => import('./features/music/music-list/music-list') },
      { path: 'music/new', loadComponent: () => import('./features/music/music-new-form/music-new-form') },
      { path: 'music/edit/:id', loadComponent: () => import('./features/music/music-edit-form/music-edit-form') },

      // Carritos
      { path: 'carts', loadComponent: () => import('./features/cart/cart-list/cart-list') },
      { path: 'cart/new', loadComponent: () => import('./features/cart/cart-new-form/cart-new-form') },

      // Ubicación y Pasarelas
      { path: 'location/new', loadComponent: () => import('./features/location/location-new-form/location-new-form') },
      { path: 'gateway/new', loadComponent: () => import('./features/gateways/gateway-new-form/gateway-new-form') },
    ]
  },
  //Dashboard Bar
  {
    path: 'bar-dashboard',
    loadComponent: () => import('./features/bar-dashboard/bar-dashboard'),
    children: [
      { path: 'events', loadComponent: () => import('./features/eventos/event-list/event-list') },
    ]
  },
  {
    path: 'events-details',
    loadComponent: () => import('./features/events/event-details/event-details'),
  },



  // ── 4. Manejo de Errores y Comodín ─────────────────────────────
  { path: '404', loadComponent: () => import('./features/page-not-found/page-not-found') },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
