import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopComponent } from './top/top.component';
import { DashboardComponent } from './mypage/dashboard/dashboard.component';
import { ProfileComponent } from './mypage/profile/profile.component';
import { InvoiceComponent } from './mypage/invoice/invoice.component';
import { PlanComponent } from './mypage/plan/plan.component';
import { InviteComponent } from './mypage/invite/invite.component';

const routes: Routes = [
  { path: "", component: TopComponent },
  { path: "mypage", component: DashboardComponent },
  { path: "mypage/profile", component: ProfileComponent },
  { path: "mypage/invoice", component: InvoiceComponent },
  { path: "mypage/plan", component: PlanComponent },
  { path: "mypage/invite", component: InviteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
