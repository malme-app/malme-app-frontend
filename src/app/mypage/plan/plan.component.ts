import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MSG_APPLY_FAILED,
  MSG_APPLY_SUCCESS,
  MSG_FETCH_FAILED
} from 'src/app/helper/notificationMessages';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plans: any[] = [];
  lastSale: any = {};

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.fetchLastSale();
    this.fetchPlans();
  }

  fetchLastSale() {
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        this.lastSale = data;
      },
      error: (_error) =>
        this._snackBar.open(MSG_FETCH_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }

  fetchPlans() {
    this.http.get(`${environment.apiBaseUrl}/plan`).subscribe({
      next: (data: any) => {
        this.plans = data;
      },
      error: (_error) =>
        this._snackBar.open(MSG_FETCH_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }

  applyForPlan(planId: number) {
    this.http.post(`${environment.apiBaseUrl}/sale`, { planId }).subscribe({
      next: (data: any) => {
        this.lastSale = data;
        this._snackBar.open(MSG_APPLY_SUCCESS, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-success'
        });
      },
      error: (_error) =>
        this._snackBar.open(MSG_APPLY_FAILED, 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed'
        })
    });
  }
}
