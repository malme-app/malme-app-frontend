import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss'],
})
export class PlanComponent {
  constructor(private router: Router) {}

  goTo(target: string) {
    this.router.navigate([target]);
  }
}
