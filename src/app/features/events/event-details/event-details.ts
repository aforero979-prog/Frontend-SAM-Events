import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpEvents } from '../../../core/services/http-events';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  imports: [ AsyncPipe, RouterLink ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export default class EventDetails {
  private activatedRouter = inject( ActivatedRoute );
  private httpEvent = inject( HttpEvents );

  event$ = new BehaviorSubject<any>({});
  selectedId!: string | null;

  private httpEvents = inject( HttpEvents );
  private activatedRoute = inject( ActivatedRoute );
  private router = inject( Router );

  formData!: FormGroup;

  constructor() {
    this.formData = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl(),
      price: new FormControl(),
      status: new FormControl(true),
      stock: new FormControl(),
      localidad: new FormControl(),
      imageUrl: new FormControl(),
      category: new FormControl(),
      initialDate: new FormControl(),
    });
  }

  onSubmit() {}

  ngOnInit() {
    this.activatedRouter.snapshot.paramMap.get('/events-details');

    this.selectedId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.selectedId);
    this.httpEvents.getEventById(this.selectedId).subscribe({
      next: (res) => {
        console.log(res.data);
        this.event$.next(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
