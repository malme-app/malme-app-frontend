import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface TableRow {
  email: string;
  role: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
})
export class InviteComponent {
  displayedColumns: string[] = ['email', 'role', 'status', 'action'];
  dataSource: TableRow[] = [].constructor(10).fill({
    email: 'firstname.lastname@company.name',
    role: 'メンバー',
    status: '承認待ち',
    action: '管理権限を委託する',
  });

  inviteForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  get inviteFormControl() {
    return this.inviteForm.controls;
  }

  onSubmitInviteForm() {
    console.log(this.inviteForm.value);
  }
}
