import { Routes } from '@angular/router';

import Home from './features/home/home';
import Eventos from './features/eventos/eventos';
import Register from './features/register/register';
import Login from './features/login/login';
import Checkout from './features/checkout/checkout';

import PageNotFound from './features/page-not-found/page-not-found';

export const routes: Routes = [
  { path: 'home', component: Home },

  { path: 'login',
    loadComponent: () => import( './features/login/login')
  },
  { path: 'register',
    loadComponent: () => import( './features/register/register')
  },
  { path: 'dashboard',
    loadComponent: () => import( './features/dashboard/dashboard')
  },
  { path: 'dashboard/user-new-form',
    loadComponent: () => import( './features/users/user-new-form/user-new-form'),
  },
  { path: 'ticket/new', 
    loadComponent: () => import( './features/ticket/ticket-new-form')  
  },
  // { path: 'eventos',
  //   loadComponent: () => import( './features/eventos/eventos')
  // },
  { path: 'photon',
    loadComponent: () => import( './features/photon/photon')
  },
  { path: 'mindagainst', 
    loadComponent: () => import( './features/mindagainst/mindagainst')
  },
  { path: 'dashboard/location-new-form',
    loadComponent: () => import( './features/location/location-new-form/location-new-form').then((m) => m.LocationNewForm,)
  },
  { path: 'dashboard/category/new',
    loadComponent: () => import( './features/categories/category-new-form/category-new-form'),
  },
  { path: 'dashboard/category/edit/:id',
    loadComponent: () => import( './features/categories/category-edit-form/category-edit-form'),
  },
  { path: 'dashboard/category/list',
    loadComponent: () => import( './features/categories/category-list/category-list'),
  },

  { path: '404', component: PageNotFound },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
];
