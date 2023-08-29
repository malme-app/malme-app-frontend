import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MSG_CANNOT_INVITE, MSG_INVITE_FAILED, MSG_INVITE_SUCCESS, MSG_SERVER_ERROR } from 'src/app/helper/notificationMessages';
import { environment } from 'src/environments/environment';

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

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) { }

  get inviteFormControl() {
    return this.inviteForm.controls;
  }

  onSubmitInviteForm() {
    this.http
      .post(
        `${environment.apiBaseUrl}/invite`,
        this.inviteForm.value
      )
      .subscribe({
        next: (_data) => {
          this._snackBar.open(MSG_INVITE_SUCCESS, 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: 'notify-success',
          });
        },
        error: (_error) =>
          this._snackBar.open(MSG_INVITE_FAILED, 'Close', {
            horizontalPosition: 'end',
            verticalPosition: 'top',
            duration: 5000,
            panelClass: 'notify-failed',
          }),
      });
  }
}
