import { Routes } from '@angular/router';
import { Home } from './features/home/home';


export const routes: Routes = [
    {path: 'home', component: Home }, // Carga todo el contenido. 

    {path: 'eventos', 
        loadComponent: () => import( `./features/eventos/eventos` ).then( m => m.Eventos) }, // Carga peresoza
        
    {path: 'register', 
        loadComponent: () => import( `./features/register/register` ).then( m => m.Register) },

    {path: 'login',
         loadComponent: () => import( `./features/login/login` ).then( m => m.Login) 

    },
    {path: 'checkout', 
  loadComponent: () => import( `./features/checkout/checkout` ).then( m => m.Checkout) },



  // para importar la ruta sin resolver la promeda thn cath, se debe poner la clase default
    {path: '404',

  loadComponent: () => import( `./features/page-not-found/page-not-found` )},
        



    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: '404', pathMatch: 'full'}
];
