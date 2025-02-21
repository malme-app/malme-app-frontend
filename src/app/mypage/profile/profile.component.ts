import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserInfoService } from 'src/app/providers/user-info.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  hasGroup = false;
  accountForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, Validators.required),
    userRole: new FormControl({ value: '', disabled: true }, Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required)
  });
  groupForm = new FormGroup({
    companyName: new FormControl('', Validators.required),
    departmentName: new FormControl('', Validators.required),
    // type: new FormControl(0, Validators.required),
    // zipcode: new FormControl('', Validators.required),
    // address: new FormControl('', Validators.required),
    // tel: new FormControl('', Validators.required),
    bankName: new FormControl('', Validators.required),
    bankBranchName: new FormControl('', Validators.required),
    bankAccountType: new FormControl('', Validators.required),
    bankAccountNumber: new FormControl('', Validators.required),
    licenses: new FormControl({ value: 0, disabled: true })
  });

  constructor(public userInfo: UserInfoService, private http: HttpClient) { }

  ngOnInit() {

    // goi api get profile, set lai form
    // update systemProfile va b2cProfile

    // this.userInfo.getSystemProfile().subscribe({
    //   next: (profile) => {
    //     this.userInfo.systemProfile = profile;

    if (this.userInfo.b2cProfile?.name) {
      this.accountForm.setValue({
        email: this.userInfo.b2cProfile.email,
        userRole: this.userInfo.systemProfile?.roles.includes('SuperAdmin')
          ? 'SuperAdmin'
          : this.userInfo.systemProfile?.roles.includes('Admin')
            ? 'Admin'
            : '',
        firstName: this.userInfo.b2cProfile.firstName ?? '',
        lastName: this.userInfo.b2cProfile.lastName ?? ''
      });
    }

    if (this.userInfo.systemProfile && this.userInfo.systemProfile.group) {
      this.hasGroup = true;
      this.groupForm.setValue({
        // type: this.userInfo.systemProfile?.group?.type ?? null,
        companyName: this.userInfo.systemProfile?.group?.companyName ?? null,
        departmentName: this.userInfo.systemProfile?.group?.departmentName ?? null,
        // zipcode: this.userInfo.systemProfile?.group?.zipcode ?? null,
        // address: this.userInfo.systemProfile?.group?.address ?? null,
        // tel: this.userInfo.systemProfile?.group?.tel ?? null,
        bankName: this.userInfo.systemProfile?.group?.bankName ?? null,
        bankBranchName: this.userInfo.systemProfile?.group?.bankBranchName ?? null,
        bankAccountType: this.userInfo.systemProfile?.group?.bankAccountType ?? null,
        bankAccountNumber: this.userInfo.systemProfile?.group?.bankAccountNumber ?? null,
        licenses: this.userInfo.systemProfile?.group?.licenses ?? 0
      });
    }

    //   },
    //   error: (error) => console.error('Error fetching profile:', error)
    // });
  }

  get accountFormControl() {
    return this.accountForm.controls;
  }

  get groupFormControl() {
    return this.groupForm.controls;
  }

  onSubmitAccountForm() {
    this.userInfo.getAcessToken().subscribe({
      next: (token) => {
        console.log('Access Token:', token)
        const header = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });
        this.http
          .patch(`${environment.apiBaseUrl}/user/update-user`, {
            id: this.userInfo.systemProfile?.id ?? 0,
            licenses: this.groupForm.controls.licenses.value,
            ...this.accountForm.value
          }, { headers: header })
          .subscribe({
            next: (data) => {
              console.log(data)
              // this.userInfo.setB2cProfile(this.accountForm.value);
            },
            error: (_error) => {
              console.log('error = ', _error);
            }
          });
      },
      error: (err) => console.error(err)
    });

  }

  onSubmitGroupForm() {
    if (!this.hasGroup) {
      this.userInfo.getAcessToken().subscribe({
        next: (token) => {
          const header = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
          });
          this.http
            .patch(`${environment.apiBaseUrl}/user/update-user`, {
              userId: this.userInfo.systemProfile?.id ?? 0,
              licenses: this.groupForm.controls.licenses.value,
              ...this.groupForm.value
            }, { headers: header })
            .subscribe({
              next: (_data) => {
                this.hasGroup = true;
                console.log(_data)
              },
              error: (_error) => {
                console.log('error = ', _error);
              }
            });
        }
      })
    } else {
      this.userInfo.getAcessToken().subscribe({
        next: (token) => {
          const header = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
          });

          this.http
            .patch(`${environment.apiBaseUrl}/user/update-user`, {
              userId: this.userInfo.systemProfile?.id ?? 0,
              licenses: this.groupForm.controls.licenses.value,
              ...this.groupForm.value
            }, { headers: header })
            .subscribe({
              next: (_data) => {
                this.hasGroup = true;
                console.log(_data)
              },
              error: (_error) => {
                console.log('error = ', _error);
              }
            });
        },
        error: (_error) => {
          console.log('error = ', _error);
        }
      });

    }
  }
}
