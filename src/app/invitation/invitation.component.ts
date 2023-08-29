import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
})
export class InvitationComponent implements OnInit {

  routeParams: Params = {};
  inviteSuccess: boolean | null = null;
  organizationName: string = '';
  message: string = '';

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.http
        .post(
          `${environment.apiBaseUrl}/invite/accept/${params.get("slug")}`,
          {}
        )
        .subscribe({
          next: (data: any) => {
            this.inviteSuccess = true;
            if (data.existingUser) {
              // Handle when existing keycloak user invited to an organization
              this.organizationName = data.organization.name;
            } else {
              // Handle when new user created in keycloak
              this.organizationName = data.organization.name;
              this.message = 'また、メールでパスワードを送信しましたのでご確認ください。';
            }
          },
          error: (_error) => {
            // Handle when error occurred
            this.inviteSuccess = false;
          }
        })
    });
  }
}
