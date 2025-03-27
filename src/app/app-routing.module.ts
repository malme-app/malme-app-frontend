import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './mypage/dashboard/dashboard.component';
import { ProfileComponent } from './mypage/profile/profile.component';
import { InvoiceComponent } from './mypage/invoice/invoice.component';
import { PlanComponent } from './mypage/plan/plan.component';
import { InviteComponent } from './mypage/invite/invite.component';
import { AuthGuard } from './app.authguard';
import { InvitationComponent } from './invitation/invitation.component';
import { Dxlogin2023Component } from './dxlogin2023/dxlogin2023.component';
import { UserComponent } from './mypage/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Member'
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Member'
    }
  },
  {
    path: 'invoice',
    component: InvoiceComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Admin'
    }
  },
  {
    path: 'plan',
    component: PlanComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Admin'
    }
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Admin'
    }
  },
  // {
  //   path: 'invite',
  //   component: InviteComponent,
  //   canActivate: [AuthGuard],
  //   data: {
  //     role: 'view-users'
  //   }
  // },
  // {
  //   path: 'invite/accept/:slug',
  //   component: InvitationComponent
  // },
  {
    path: 'dxlogin2023',
    component: Dxlogin2023Component
  },
  {
    path: '**',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
