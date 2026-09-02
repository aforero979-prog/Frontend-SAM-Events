import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpBar } from '../../../core/services/http-bar';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-bar-details',
  imports: [ AsyncPipe, RouterLink],
  templateUrl: './bar-details.html',
  styleUrl: './bar-details.css',
})
export default class BarDetails {


    bar$ = new BehaviorSubject<any>({});
    selectedId!: string | null;
  
    private httpBars = inject(HttpBar);
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
  
    ngOnInit() {
      this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
  
      console.log( this.selectedId );  
      this.httpBars.getBarById(this.selectedId).subscribe({
          next: (res) => {
              console.log(res.data);
              this.bar$.next(res.data);
          },
          error: (err) => {
              console.error(err);
          },
      });
  }



}
