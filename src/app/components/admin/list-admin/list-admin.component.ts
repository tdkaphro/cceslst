import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { HelperService } from 'src/app/utils/helper.service';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { UserInfo } from 'src/app/models/user-info.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import * as Constants from 'src/app/utils/constants';
import * as Endpoint from 'src/app/utils/endpoints';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Location } from '@angular/common';
import { PopupFeedbackComponent } from 'src/app/shared/popup-feedback/popup-feedback.component';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.css']
})
export class ListAdminComponent implements OnInit {

  currentAdmin: UserInfo;

  displayedColumns: string[] = ['nom', 'email', 'login', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  adminsResult: any;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private dialog: MatDialog,
    private authService: AuthService,
    private location: Location,
    private toast: ToastService
  ) {

    this.currentAdmin = this.authService.getCurrentUser();
    if (this.currentAdmin.type !== 'S') {
      this.location.back();
    }

    this.adminsResult = this.activatedRoute.snapshot.data.value;

    if (this.adminsResult) {
      this.dataSource.data = this.adminsResult.content;
    } else {
      this.logout();
    }

  }

  ngOnInit() {
    //this.companies = this.toolAppResponse.data;
  }

  addAdmin() {
    this.router.navigate(['/admin/main/new-admin']);
  }

  ngAfterViewInit() {
    if (this.adminsResult) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  archiveAdmin(row: UserInfo) {
    let message = 'Etes vous sûr de désactiver cet admin?';
    if (row.etat === 'B')
      message = 'Etes vous sûr d\'activer cet admin?';
    this.openAlertDialog(
      message,
      Constants.WARNING,
      true,
      Constants.COLOR_BLACK,
      Constants.COLOR_YELLOW,
      Constants.ACTION_DELETE,
      row);
  }

  private openAlertDialog(message, title, showAction, color, bg_color, action, data) {
    const alertDialogRef = this.dialog.open(PopupFeedbackComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message, title: title, showAction: showAction, color: color, bg_color: bg_color }
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result === Constants.CONFIRM) {
        if (action === Constants.ACTION_DELETE) {
          this.confirmArchiveAdmin(data);
        }
      }
    });
  }

  confirmArchiveAdmin(admin: UserInfo) {
    let etat = 'B';
    if (admin.etat === 'B')
      etat = 'A';
    const payload = new HttpParams()
      .set('login', admin.login)
      .set('etat', etat)
      .set('userOp', this.currentAdmin.login);
    this.api.postData(Endpoint.ARCHIVE_ADMIN, payload, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0000':
            let message = 'Admin archivé(e) avec succès!';
            if (etat === 'A')
              message = 'Admin activé(e) avec succès!';
            this.toast.success(message, { closeButton: true, progressBar: true });
            this.updateStatus(admin, etat);
            break;
          default:
            this.toast.error(res.resultMsg, { closeButton: true, progressBar: true });
        }
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  updateStatus(admin: UserInfo, etat) {
    let index = this.dataSource.data.findIndex(item => item.login === admin.login);
    this.dataSource.data[index].etat = etat;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
