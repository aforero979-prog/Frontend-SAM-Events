import { environment } from '../../../environments/environment.development';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpAuth {

  private http = inject( HttpClient );
  private router = inject( Router )
  private platformId = inject( PLATFORM_ID )

  currentUser$ = new BehaviorSubject<any>(null)
  currentToken = new BehaviorSubject<any>(null)
  isLoggedIn = signal<boolean>(false)

  constructor() {
    // Sincronizar estado desde localStorage al iniciar la app
    this.syncFromStorage();
  }

  /** Lee token y usuario de localStorage y actualiza los observables/signals */
  syncFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userRaw = localStorage.getItem('user');
      if (token && userRaw) {
        try {
          const user = JSON.parse(userRaw);
          this.currentToken.next(token);
          this.currentUser$.next(user);
          this.isLoggedIn.set(true);
        } catch {
          this.isLoggedIn.set(false);
        }
      } else {
        this.isLoggedIn.set(false);
      }
    }
  }

  loginUser(credentials: any) {
    //Credentials = email y password
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((data) => {

        if(data?.token && data?.data) {
          localStorage.setItem('token', data?.token);
          localStorage.setItem('user', JSON.stringify(data.data));
          this.currentToken.next(data.token);
          this.currentUser$.next(data.data);
          this.isLoggedIn.set(true);
        }
      }),
      map((data) => data.msg),

      catchError((err: HttpErrorResponse) => {
        const msgError = err.error?.msg || 'Error al iniciar sesión';
        console.error(msgError);
        throw err;
      }),
    );
  }

  /** Cierra sesión: limpia localStorage y redirige a /home */
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.currentToken.next(null);
    this.currentUser$.next(null);
    this.isLoggedIn.set(false);
    this.router.navigateByUrl('/home');
  }

  /** Devuelve el usuario actual desde localStorage */
  getCurrentUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const userRaw = localStorage.getItem('user');
      if (userRaw) {
        try { return JSON.parse(userRaw); } catch { return null; }
      }
    }
    return null;
  }

  seveDataLocalStorage( token: any, user: any) {

    if( isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }

    this.currentUser$.next(user)
    this.currentToken.next(token)
    this.isLoggedIn.set(true)
  }

  getDataLocalStorage() {

    let token;

    if( isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token')
    }
    return token;
  }
}
