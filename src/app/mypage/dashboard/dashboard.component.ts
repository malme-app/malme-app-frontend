import { Component } from '@angular/core';
import { UserInfoService } from 'src/app/providers/user-info.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(public userInfo: UserInfoService) {}
  goTutorial() {
    window.open('https://malme.net');
  }
}
