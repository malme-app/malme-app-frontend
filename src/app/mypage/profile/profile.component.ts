import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MSG_CREATE_FAILED, MSG_CREATE_SUCCESS, MSG_UPDATE_FAILED, MSG_UPDATE_SUCCESS } from 'src/app/helper/notificationMessages';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  hasOrganization = false;
  organizationForm = new FormGroup({
    userRole: new FormControl(
      { value: 'SuperAdmin', disabled: true },
      Validators.required
    ),
    name: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    type: new FormControl(0, Validators.required),
    zipcode: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    bankBranchName: new FormControl('', Validators.required),
    bankAccountType: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', Validators.required),
    licenses: new FormControl({ value: 0, disabled: true }),
  });

  constructor(
    public userInfo: UserInfoService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userInfo.syncSystemProfile().add(() => {
      if (this.userInfo.systemProfile && this.userInfo.systemProfile.organization) {
        this.hasOrganization = true;
        this.organizationForm.setValue({
          type: this.userInfo.systemProfile?.organization?.type ?? null,
          userRole: this.userInfo.systemProfile?.roles.includes('SuperAdmin') ? 'SuperAdmin' : (this.userInfo.systemProfile?.roles.includes('Admin') ? 'Admin' : ''),
          name: this.userInfo.systemProfile?.organization?.name ?? null,
          department: this.userInfo.systemProfile?.organization?.department ?? null,
          zipcode: this.userInfo.systemProfile?.organization?.zipcode ?? null,
          address: this.userInfo.systemProfile?.organization?.address ?? null,
          tel: this.userInfo.systemProfile?.organization?.tel ?? null,
          bankName: this.userInfo.systemProfile?.organization?.bankName ?? null,
          bankBranchName: this.userInfo.systemProfile?.organization?.bankBranchName ?? null,
          bankAccountType: this.userInfo.systemProfile?.organization?.bankAccountType ?? null,
          bankAccountNumber: this.userInfo.systemProfile?.organization?.bankAccountNumber ?? null,
          licenses: this.userInfo.systemProfile?.organization?.licenses ?? 0,
        });
      }
    });
  }

  get organizationFormControl() {
    return this.organizationForm.controls;
  }

  onSubmitOrganizationForm() {
    if (!this.hasOrganization) {
      this.http
        .post(
          `${environment.apiBaseUrl}/organization`,
          this.organizationForm.value
        )
        .subscribe({
          next: (_data) => {
            this._snackBar.open(MSG_CREATE_SUCCESS, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success',
            });
            this.hasOrganization = true;
          },
          error: (_error) =>
            this._snackBar.open(MSG_CREATE_FAILED, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed',
            }),
        });
    } else {
      this.http
        .put(
          `${environment.apiBaseUrl}/organization`,
          this.organizationForm.value
        )
        .subscribe({
          next: (_data) => {
            this._snackBar.open(MSG_UPDATE_SUCCESS, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success',
            });
            this.hasOrganization = true;
          },
          error: (_error) =>
            this._snackBar.open(MSG_UPDATE_FAILED, 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed',
            }),
        });
    }
  }
}
