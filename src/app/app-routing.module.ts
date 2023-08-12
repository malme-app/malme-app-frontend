import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopComponent } from './top/top.component';
import { DashboardComponent } from './mypage/dashboard/dashboard.component';
import { ProfileComponent } from './mypage/profile/profile.component';
import { InvoiceComponent } from './mypage/invoice/invoice.component';
import { PlanComponent } from './mypage/plan/plan.component';
import { InviteComponent } from './mypage/invite/invite.component';
import { AuthGuard } from './app.authguard';
import { InvitationComponent } from './invitation/invitation.component';

const routes: Routes = [
  { path: '', component: TopComponent },
  { path: 'invitation', component: InvitationComponent },
  { path: 'mypage', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'mypage/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mypage/invoice',
    component: InvoiceComponent,
    canActivate: [AuthGuard],
  },
  { path: 'mypage/plan', component: PlanComponent, canActivate: [AuthGuard] },
  {
    path: 'mypage/invite',
    component: InviteComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
