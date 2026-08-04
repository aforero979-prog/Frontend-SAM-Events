import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID, Service } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, of, tap } from 'rxjs';

@Service()
export class HttpAuth {

  private http = inject( HttpClient );
  private router = inject( Router )
  private platformId = inject( PLATFORM_ID )

  currentUser$ = new BehaviorSubject<any>(null)
  currentToken = new BehaviorSubject<any>(null)


  loginUser(credentials: any) {
    //Credentials = email y password
    return this.http.post<any>('http://localhost:3000/api/auth/login', credentials).pipe(
      tap((data) => {

        if(data?.token && data?.data) {
        localStorage.setItem('token', data?.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        this.router.navigateByUrl( '/dashboard' )
        }

        // console.log( data )
      }),
      map((data) => data.msg),

      catchError( ( err: HttpErrorResponse ) => {

        const msgError = err.error.msg || 'Error al inicar sesión'

        console.error( msgError )

        return of ( msgError )
      }),
    );
  }

  seveDataLocalStorage( token: any, user: any) {

    if( isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    }

    this.currentUser$.next(user)
    this.currentToken.next(token)
  }

  getDataLocalStorage() {

    let token;

    if( isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token')
    }
  }
}
