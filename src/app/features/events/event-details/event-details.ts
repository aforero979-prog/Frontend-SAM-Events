import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpEvents } from '../../../core/services/http-events';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-event-details',
  imports: [],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export default class EventDetails {

  private activatedRouter = inject( ActivatedRoute )
  private httpEvent = inject( HttpEvents )

  formData!: FormGroup

    constructor() {
    this.formData = new FormGroup({
      name: new FormControl( '', Validators.required ),
      description: new FormControl(),
      price: new FormControl(),
      status: new FormControl( true ),
      stock: new FormControl(),
      localidad: new FormControl(),
      imageUrl: new FormControl(),
      category: new FormControl(),
      initialDate: new FormControl()
    });
  }

  onSubmit( ) {

  }


  ngOnInit(){
    this.activatedRouter.snapshot.paramMap.get( '/events-details' )
  }
}
