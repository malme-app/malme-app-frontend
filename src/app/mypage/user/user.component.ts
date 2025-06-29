import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/service/notification.service';
import { PermissionService } from 'src/app/service/permission.service';
import { CustomPaginator } from './CustomPaginatorConfiguration';
import { MatPaginatorIntl } from '@angular/material/paginator';

export interface User {
  azureB2CId: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useValue: CustomPaginator() }]
})
export class UserComponent {
  public displayedColumns: string[] = ['username', 'role', 'action'];
  public dataSourceUsers = new MatTableDataSource<User>();
  public users: User[] = [];
  public roleList: string[] = [];
  public searchValue = '';
  public pageIndex = 0;
  public pageSize = 10;
  public length = 1;
  public disabled = false;
  isLoading = false;
  isLoadCompanyRoles = false;
  readonly dialog = inject(MatDialog);
  public companyRoles: any[] = [];

  private searchSubject = new Subject<string>();
  @ViewChild(MatPaginator) paginator: any;

  constructor(
    private permissionService: PermissionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.fetchPermissions();
    this.fetchUsersCompany();
    this.fetchCompanyRoles();
    this.searchSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.searchValue = value;
      this.fetchUsersCompany();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  fetchPermissions() {
    this.isLoading = true;
    this.permissionService.getListPermission().subscribe({
      next: (res) => {
        this.roleList = res;
        this.isLoading = false;
      },
      error: (error) => {
        console.log('Failed to fetch list roles: ', error);
        this.notificationService.showNotification('表示可能な製品の権限が存在しません。');
        this.isLoading = false;
      }
    });
  }

  fetchUsersCompany() {
    this.isLoading = true;
    this.permissionService
      .getUsersCompany(this.pageIndex + 1, this.pageSize, this.searchValue)
      .subscribe({
        next: (res) => {
          this.users = res.data;
          this.length = res.total;
          this.disabled = false;
          this.dataSourceUsers = new MatTableDataSource<any>(this.users);
          this.isLoading = false;
        },
        error: (err) => {
          this.disabled = false;
          console.log('Failed to fetch list users: ', err.error.message);
          this.notificationService.showNotification('表示可能な製品の権限が存在しません。');
          this.isLoading = false;
        }
      });
  }

  fetchCompanyRoles() {
    this.permissionService.getCompanyRolesInformation().subscribe({
      next: (res) => {
        this.companyRoles = res;
        this.isLoadCompanyRoles = true;
      },
      error: (err) => {
        console.log('Failed to fetch company roles: ', err.error.message);
        this.isLoadCompanyRoles = true;
        // this.notificationService.showNotification('表示可能な製品の権限が存在しません。');
      }
    });
  }

  updateUserRoles(user: User, newRoles: string[]) {
    user.roles = [...newRoles];
  }

  submitForm(element: any) {
    this.isLoading = true;
    this.permissionService.updateUserRole(element).subscribe({
      next: () => {
        this.fetchUsersCompany();
        this.fetchCompanyRoles();
        this.notificationService.showNotification('ユーザーの権限を更新しました。');
        this.isLoading = false;
      },
      error: (err) => {
        this.fetchUsersCompany();
        this.fetchCompanyRoles();
        console.log('Failed to update user: ', err.error.message);
        // this.notificationService.showNotification(
        //   'エラーが発生したため、ユーザー権限の更新に失敗しました。'
        // );
        this.notificationService.showNotification(err.error.message);
        this.isLoading = false;
      }
    });
  }

  onOpenGroupDialog(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'ユーザーの権限を更新してよろしいですか？',
        message: '',
        acceptBtn: 'OK',
        cancelBtn: 'キャンセル'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.submitForm(element);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  handlePageEvent($event: any) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.length = $event.length;
    this.disabled = true;
    this.fetchUsersCompany();
  }
}
