import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-required',
  templateUrl: './login-required.html',
  styleUrl: './login-required.css'
})
export default class LoginRequired implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 3000);
  }
}
