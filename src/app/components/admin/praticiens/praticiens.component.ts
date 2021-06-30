import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/api/api.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import * as Constants from 'src/app/utils/constants';
import * as Endpoint from 'src/app/utils/endpoints';
import { ToastService } from 'src/app/utils/toast.service';
import { UserInfo } from 'src/app/models/user-info.model';
import { HttpParams } from '@angular/common/http';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { PopupFeedbackComponent } from 'src/app/shared/popup-feedback/popup-feedback.component';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-praticiens',
  templateUrl: './praticiens.component.html',
  styleUrls: ['./praticiens.component.css']
})
export class PraticiensComponent implements OnInit, AfterViewInit {

  currentAdmin: UserInfo;

  displayedColumns: string[] = ['nom', 'email', 'telFixe', 'telPortable', 'ville', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  activePraticien: any;
  inactivePraticien: any;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private router: Router,
    private dialog: MatDialog,
    private routerOutlet: RouterOutlet,
    private authService: AuthService
  ) {
    // Create 100 users

    // Assign the data to the data source for the table to render

    this.currentAdmin = this.authService.getCurrentUser();

    this.activePraticien = this.activatedRoute.snapshot.data.value[0];
    this.inactivePraticien = this.activatedRoute.snapshot.data.value[1];

    if (this.activePraticien && this.inactivePraticien) {
      this.activePraticien.content = this.activePraticien.content.filter(user => user.etat !== 'B');
      this.dataSource.data = this.inactivePraticien.content.concat(this.activePraticien.content);
    } else {
      this.logout();
    }

  }

  ngOnInit() {
    //this.companies = this.toolAppResponse.data;
  }

  ngAfterViewInit() {
    if (this.activePraticien && this.inactivePraticien) {
      this.dataSource.paginator = this.paginator;
    }
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  acceptUser(user: UserInfo) {
    this.openAlertDialog(
      'Etes vous sûr d\'accepter ce praticien?',
      Constants.WARNING,
      true,
      Constants.COLOR_BLACK,
      Constants.COLOR_YELLOW,
      Constants.ACTION_ACTIVATE,
      user);
  }

  resetPassword(user: UserInfo) {
    this.openAlertDialog(
      'Un nouveau mot de passe sera envoyé par mail à <strong>' + user.email + '</strong>. Voulez-vous continuez?',
      Constants.WARNING,
      true,
      Constants.COLOR_BLACK,
      Constants.COLOR_YELLOW,
      Constants.RESET_PASSWORD,
      user);
  }

  freezeUser(user: UserInfo) {
    this.openAlertDialog(
      'Etes vous sûr de désactiver ce praticien?',
      Constants.WARNING,
      true,
      Constants.COLOR_BLACK,
      Constants.COLOR_YELLOW,
      Constants.ACTION_FREEZE,
      user);
  }

  deleteUser(user: UserInfo) {
    this.openAlertDialog(
      'Etes vous sûr de supprimer ce praticien?<br><b>NB:</b> Si vous supprimez cet utilisateur, l\'adresse e-mail sera ajoutée à la liste noire et ne pourra plus être utilisée.',
      Constants.WARNING,
      true,
      Constants.COLOR_BLACK,
      Constants.COLOR_YELLOW,
      Constants.ACTION_DELETE,
      user);
  }

  private openAlertDialog(message, title, showAction, color, bg_color, action, user) {
    const alertDialogRef = this.dialog.open(PopupFeedbackComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message, title: title, showAction: showAction, color: color, bg_color: bg_color }
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result === Constants.CONFIRM) {
        if (action === Constants.ACTION_ACTIVATE) {
          this.confirmUpdateUserStatus(user, 'A');
        } else if (action === Constants.ACTION_FREEZE) {
          if (user.etat === 'I') {
            this.confirmUpdateUserStatus(user, 'R');
          } else {
            this.confirmUpdateUserStatus(user, 'B');
          }
        } else if (action === Constants.ACTION_DELETE) {
          if (user.etat === 'I') {
            this.confirmUpdateUserStatus(user, 'R');
          } else {
            this.confirmUpdateUserStatus(user, 'S');
          }
        } else if (action === Constants.RESET_PASSWORD) {
          this.confirmResetPassword(user);
        }
      }
    });
  }

  confirmUpdateUserStatus(user: UserInfo, etat: string) {
    const payload = new HttpParams()
      .set('login', user.login)
      .set('etat', etat)
      .set('userOp', this.currentAdmin.login);
    this.api.postData(Endpoint.ACTIVATE_PRATICIEN, payload, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0000':
            let message = 'Praticien activé(e) avec succès!';
            if (etat === 'B')
              message = 'Praticien désactivé(e) avec succès!';
            else if (etat === 'S')
              message = 'Praticien supprimé(e) avec succès!';
            this.toast.success(message, { closeButton: true, progressBar: true });
            this.updateStatus(user, etat);
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
  confirmResetPassword(user: UserInfo) {
    const payload = new HttpParams()
      .set('login', user.login)
      .set('userOp', this.currentAdmin.login);
    this.api.postData(Endpoint.RESET_USER_PASSWORD, payload, AuthorizationType.Token).subscribe(res => {
      if (res) {
        if (res.resultCode === '0000') {
          const message = 'Un nouveau mot de passe a été envoyé à ' + user.email;
          this.toast.success(message, { closeButton: true, progressBar: true });
        } else {
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

  updateStatus(user: UserInfo, etat) {
    let index = this.dataSource.data.findIndex(item => item.login === user.login);
    this.dataSource.data[index].etat = etat;
    if (etat === 'S' || etat === 'B')
      this.dataSource.data = this.dataSource.data.filter(item => item.etat !== etat);
  }

}