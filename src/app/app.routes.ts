import { Routes } from '@angular/router';

import Home from './features/home/home';
import Register from './features/register/register';
import Login from './features/login/login';
import Checkout from './features/checkout/checkout';

import PageNotFound from './features/page-not-found/page-not-found';

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: '404', component: PageNotFound },

  { path: 'login',
    loadComponent: () => import( './features/login/login')
  },
  { path: 'register',
    loadComponent: () => import( './features/register/register')
  },
  { path: 'photon',
    loadComponent: () => import( './features/photon/photon')
  },
  { path: 'mindagainst', 
    loadComponent: () => import( './features/mindagainst/mindagainst')
  },
  { path: 'dashboard',
    loadComponent: () => import( './features/dashboard/dashboard')
  },
  { path: 'photon',
    loadComponent: () => import( './features/photon/photon')
  },
  { path: 'mindagainst', 
    loadComponent: () => import( './features/mindagainst/mindagainst')
  },
  { path: 'saralandry',
    loadComponent: () => import( './features/saralandry/saralandry')
  },
  { path: 'events',
    loadComponent: () => import( './features/events/event-list/event-list')
  },
  { path: 'events-details',
    loadComponent: () => import( './features/events/event-details/event-details')
  },
  { path: 'dashboard/events-new',
    loadComponent: () => import( './features/events/event-new-form/event-new-form'),
  },
  { path: 'dashboard/user-new-form',
    loadComponent: () => import( './features/users/user-new-form/user-new-form')
  },
  { path: 'dashboard/location-new-form',
    loadComponent: () => import( './features/location/location-new-form/location-new-form')
  },
  { path: 'dashboard/ticket/new', 
    loadComponent: () => import( './features/ticket/ticket-new-form')  
  },
  { path: 'dashboard/category/list',
    loadComponent: () => import( './features/categories/category-list/category-list')
  },
  { path: 'dashboard/category/new',
    loadComponent: () => import( './features/categories/category-new-form/category-new-form')
  },
  { path: 'dashboard/category/edit/:id',
    loadComponent: () => import( './features/categories/category-edit-form/category-edit-form')
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
