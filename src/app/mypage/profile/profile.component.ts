import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

interface Organization {
  id: number;
  status: number;
  name: string;
  divisionName: string;
  type: number;
  zipCode: string;
  address: string;
  tel: string;
  bankName: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  licenses: number;
}

interface SystemProfile {
  id: number;
  uid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  status: number;
  role: string;
  organization: Organization | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  hasProfile = false;
  hasOrganization = false;
  organizationForm = new FormGroup({
    organizationType: new FormControl(0, Validators.required),
    userRole: new FormControl(
      { value: 'admin', disabled: true },
      Validators.required
    ),
    organizationName: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    zipcode: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    tel: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    branchName: new FormControl('', Validators.required),
    bankAccountType: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', Validators.required),
    licenseNumber: new FormControl(1, Validators.required),
  });

  constructor(
    public userInfo: UserInfoService,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.http.get(`${environment.apiBaseUrl}/user`).subscribe(
      (data) => {
        const systemProfile: SystemProfile = data as SystemProfile;
        this.hasProfile = !!systemProfile;
        if (systemProfile?.organization) {
          this.hasOrganization = true;
          this.organizationForm.setValue({
            organizationType: systemProfile?.organization?.type ?? null,
            userRole: systemProfile?.role ?? 'admin',
            organizationName: systemProfile?.organization?.name ?? null,
            department: systemProfile?.organization?.divisionName ?? null,
            zipcode: systemProfile?.organization?.zipCode ?? null,
            address: systemProfile?.organization?.address ?? null,
            tel: systemProfile?.organization?.tel ?? null,
            bankName: systemProfile?.organization?.bankName ?? null,
            branchName: systemProfile?.organization?.branchName ?? null,
            bankAccountType: systemProfile?.organization?.accountType ?? null,
            bankAccountNumber:
              systemProfile?.organization?.accountNumber ?? null,
            licenseNumber: systemProfile?.organization?.licenses ?? null,
          });
        }
      },
      (_error) =>
        this._snackBar.open('Failed to fetch data!', 'Close', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: 'notify-failed',
        })
    );
  }

  get organizationFormControl() {
    return this.organizationForm.controls;
  }

  onSubmitOrganizationForm() {
    if (!this.hasProfile) {
      this.http
        .post(
          `${environment.apiBaseUrl}/organization/user`,
          this.organizationForm.value
        )
        .subscribe({
          next: (_data) => {
            this._snackBar.open('Successfully created!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success',
            });
            this.hasProfile = true;
            this.hasOrganization = true;
          },
          error: (_error) =>
            this._snackBar.open('Failed to create data!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed',
            }),
        });
    } else if (!this.hasOrganization) {
      this.http
        .post(
          `${environment.apiBaseUrl}/organization`,
          this.organizationForm.value
        )
        .subscribe({
          next: (_data) => {
            this._snackBar.open('Successfully created!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success',
            });
            this.hasProfile = true;
            this.hasOrganization = true;
          },
          error: (_error) =>
            this._snackBar.open('Failed to create data!', 'Close', {
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
            this._snackBar.open('Successfully updated!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-success',
            });
            this.hasProfile = true;
            this.hasOrganization = true;
          },
          error: (_error) =>
            this._snackBar.open('Failed to update data!', 'Close', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
              duration: 5000,
              panelClass: 'notify-failed',
            }),
        });
    }
  }
}
