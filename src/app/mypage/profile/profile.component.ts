import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  organizationForm = new FormGroup({
    organizationName: new FormControl('株式会社XXXXXX', Validators.required),
    department: new FormControl('開発部', Validators.required),
    zipcode: new FormControl('000-0000', Validators.required),
    address: new FormControl('東京都千代田区麹町', Validators.required),
    tel: new FormControl('50-1742-2028', Validators.required),
    bankName: new FormControl('三菱UFJ銀行', Validators.required),
    accountType: new FormControl('普通', Validators.required),
    accountNumber: new FormControl('1234567', Validators.required),
    licenseNumber: new FormControl('5', Validators.required),
  });

  accountTypeForm = new FormGroup({
    accountType: new FormControl('0', Validators.required),
    accountRole: new FormControl(
      { value: '0', disabled: true },
      Validators.required
    ),
  });

  get organizationFormControl() {
    return this.organizationForm.controls;
  }
  get accountTypeFormControl() {
    return this.accountTypeForm.controls;
  }

  onSubmitOrganizationForm() {
    console.log(this.organizationForm.value);
  }

  onSubmitAccountTypeForm() {
    console.log(this.accountTypeForm.value);
  }
}
