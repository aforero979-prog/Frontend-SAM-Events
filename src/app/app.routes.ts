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
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard') },
  { path: 'events', loadComponent: () => import('./features/events/event-list/event-list') },
  {
    path: 'events-details',
    loadComponent: () => import('./features/events/event-details/event-details'),
  },
  
  // ── Tickets ──────────────────────────────────────

  { path: 'buy-ticket', loadComponent: () => import('./features/ticket/ticket-new-form') },

  // ── Users ────────────────────────────────────────
  {
    path: 'dashboard/user-new-form',
    loadComponent: () => import('./features/users/user-new-form/user-new-form'),
  },

  // ── Locations ────────────────────────────────────
  {
    path: 'dashboard/location-new-form',
    loadComponent: () => import('./features/location/location-new-form/location-new-form'),
  },
  // ── Categories ───────────────────────────────────
  {
    path: 'dashboard/category/new',
    loadComponent: () => import('./features/categories/category-new-form/category-new-form'),
  },
  {
    path: 'dashboard/category/edit/:id',
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form'),
  },
  {
    path: 'dashboard/category/list',
    loadComponent: () => import('./features/categories/category-list/category-list'),
  },
  {
    path: 'dashboard/category/new',
    loadComponent: () => import('./features/categories/category-new-form/category-new-form'),
  },
  {
    path: 'dashboard/category/edit/:id',
    loadComponent: () => import('./features/categories/category-edit-form/category-edit-form'),
  },

  // ── Events ───────────────────────────────────────
  {
    path: 'dashboard/event/new',
    loadComponent: () => import('./features/events/event-new-form/event-new-form'),
  },

  // ── Posts ────────────────────────────────────────
  {
    path: 'dashboard/post/new',
    loadComponent: () => import('./features/posts/post-new-form/post-new-form'),
  },
  {
    path: 'dashboard/post/list',
    loadComponent: () => import('./features/posts/post-list/post-list'),
  },
  {
    path: 'dashboard/post/edit/:id',
    loadComponent: () => import('./features/posts/post-edit-form/post-edit-form'),
  },

  // ── Gateways ─────────────────────────────────────
  {
    path: 'dashboard/gateway/new',
    loadComponent: () => import('./features/gateways/gateway-new-form/gateway-new-form'),
  },

  { path: '404', component: PageNotFound },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
