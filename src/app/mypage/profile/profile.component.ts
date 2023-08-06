import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { UserInfoService } from 'src/app/providers/user-info.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  organizationForm = new FormGroup({
    organizationType: new FormControl('0', Validators.required),
    userRole: new FormControl(
      { value: '0', disabled: true },
      Validators.required
    ),
    organizationName: new FormControl('株式会社XXXXXX', Validators.required),
    department: new FormControl('開発部', Validators.required),
    zipcode: new FormControl('000-0000', Validators.required),
    address: new FormControl('東京都千代田区麹町', Validators.required),
    tel: new FormControl('50-1742-2028', Validators.required),
    bankName: new FormControl('三菱UFJ銀行', Validators.required),
    bankAccountType: new FormControl('普通', Validators.required),
    bankAccountNumber: new FormControl('1234567', Validators.required),
    licenseNumber: new FormControl('5', Validators.required),
  });

  constructor(public userInfo: UserInfoService) {}

  get organizationFormControl() {
    return this.organizationForm.controls;
  }

  onSubmitOrganizationForm() {
    console.log(this.organizationForm.value);
  }
}
