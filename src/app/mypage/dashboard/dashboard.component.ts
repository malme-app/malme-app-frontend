import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentPlanNameList = [];
  isLoading = true;
  constructor(public userInfo: UserInfoService, private http: HttpClient) {}

  ngOnInit() {
    this.userInfo.loadingSubject.subscribe((res) => (this.isLoading = res));
    this.userInfo.syncSystemProfile();
    this.http.get(`${environment.apiBaseUrl}/sale/active`).subscribe({
      next: (data: any) => {
        this.currentPlanNameList = data.map((item: any) => item.planname);
      },
      error: (_error) => {
        console.log('error = ', _error);
      }
    });
  }

  goTutorial() {
    window.open(
      'https://fresh-tachometer-148.notion.site/Malme-app-Hub-81aaa47e70af4d41ad5c68e011fad92b'
    );
  }
}
