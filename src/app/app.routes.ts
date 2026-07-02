import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { UserList } from './features/users/user-list/user-list';

export const routes: Routes = [
    //Paths:
    //Esta ruta carga por defecto el componente asociado a la ruta
    {path: 'home', component: Home },
    //Rutas con LazyLoad 
    {path: 'categorie-new',
        loadComponent: () => import('./features/categories/categories-new-form/categories-new-form').then(m => m.CategoriesNewForm)
    },
    {path: 'user/list',
        loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList)
    },
    {path: 'eventos', 
        loadComponent: () => import('./features/eventos/eventos').then(m => m.Eventos) 
    },
    {path: 'register',
        loadComponent: () => import('./features/register/register').then(m => m.Register)
    },
    {path: 'login', 
        loadComponent: () => import('./features/login/login').then(m => m.Login)
    },
    {path: 'checkout', 
        loadComponent: () => import('./features/checkout/checkout').then(m => m.Checkout)
    },
    //Para importar la ruta sin resolver la promesa unsando then/catch, se debe exportar ka cakse cini default (ver en PageNotFound.ts)
    //Al exportar con default desde PageNotFound.ts se resuelve la promesa desde ese momento por lo cual no es necesario utilizar en then/catch
    {path: '404', 
        loadComponent: () => import('./features/page-not-found/page-not-found')
    },
    //Redirections:
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: '404', pathMatch: 'full'}
];
