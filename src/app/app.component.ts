import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'structuralengine-platform';

  constructor(private router: Router) {}

  login() {
    console.log('login handler');
  }

  logout() {
    this.router.navigate(['/']);
  }

  signup() {
    console.log('signup handler');
  }

  goMypage() {
    this.router.navigate(['/mypage']);
  }
}
