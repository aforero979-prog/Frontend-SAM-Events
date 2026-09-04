import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpBar } from '../../../core/services/http-bar';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';


@Component({
    selector: 'bar-home',
    imports: [RouterLink, AsyncPipe, JsonPipe],
    templateUrl: './bar-home.html',
    styleUrl: './bar-home.css',
})

export default class BarHome {
    barList$ = new BehaviorSubject<any>([])

    private httpBars = inject( HttpBar )
    private router = inject( Router )

    ngOnInit() {
        this.httpBars.getBars().subscribe({
            next: ( res ) => {
                console.log( res )

                this.barList$.next( res )
            },
            error: ( err ) => {
                console.error( err )
            },
            complete: () => {}
        })
    }

    handleBarImageError(event: any) {
        event.target.src = '/assets/default-bar.jpg';
    }
}