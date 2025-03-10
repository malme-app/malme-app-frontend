import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {
  plans: any[] = [];
  lastSale: any = {};
  hasGroup = false;
  readonly dialog = inject(MatDialog);

  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.fetchLastSale();
    this.fetchPlans();
    if (this.userInfo.systemProfile && this.userInfo.systemProfile.group) {
      this.hasGroup = true;
    }
  }

  fetchLastSale() {
    this.http.get(`${environment.apiBaseUrl}/sale/last`).subscribe({
      next: (data: any) => {
        this.lastSale = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  fetchPlans() {
    this.http.get(`${environment.apiBaseUrl}/plan`).subscribe({
      next: (data: any) => {
        this.plans = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  onOpenDialog(planId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title:
          'このプラン変更のリクエストを管理者に送信してもよろしいでしょうか？ \nリクエストが送信されると、ご担当者から変更プランについてご案内いたします。',
        acceptBtn: 'OK',
        cancelBtn: 'キャンセル'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applyForPlan(planId);
      }
    });
  }

  applyForPlan(planId: number) {
    this.http.post(`${environment.apiBaseUrl}/sale`, { planId }).subscribe({
      next: (data: any) => {
        this.lastSale = data;
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }
}
