import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Traitement } from 'src/app/models/traitement.model';
import { UserInfo } from 'src/app/models/user-info.model';
import { ApiService } from 'src/app/api/api.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-praticien',
  templateUrl: './praticien.component.html',
  styleUrls: ['./praticien.component.css']
})
export class PraticienComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nomPatient', 'typeTraitement', 'dateCreation', 'etape'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  listTraitements: Array<Traitement> = [];
  userInfo: UserInfo;

  traitementsResult: any;
  userInfoResult: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private api: ApiService,
    private dialog: MatDialog,
    private toast: ToastService
  ) {
    this.traitementsResult = this.activatedRoute.snapshot.data.value[1];
    this.userInfoResult = this.activatedRoute.snapshot.data.value[0];

    //console.log(this.traitementsResult);
    //console.log(this.userInfoResult);

    if (this.traitementsResult && this.userInfoResult) {
      this.listTraitements = this.traitementsResult.content;
      this.userInfoResult.content.type = this.refactorType(this.userInfoResult.content.type);
      this.userInfo = this.userInfoResult.content;
      this.dataSource.data = this.listTraitements;
    } else {
      this.logout();
    }
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  public getTypeTraitement(typeTraitement) {
    switch (typeTraitement.toUpperCase()) {
      case 'D':
        return 'Aligneurs sup/inf';
      case 'I':
        return 'Aligneurs inférieurs';
      case 'S':
        return 'Aligneurs supérieurs';
    }
  }

  refactorType(value: string) {
    switch (value.toUpperCase()) {
      case 'D':
        return 'Dentiste';
      case 'O':
        return 'Orthodontiste';
    }
  }

  /*askToArchiveUser() {
    this.openAlertDialog(
      "Etes vous sûr d'archiver cet utilisateur?",
      Constants.WARNING,
      true,
      Constants.COLOR_WHITE,
      Constants.COLOR_YELLOW,
      Constants.ACTION_DELETE);
  }

  askToActivateUser() {
    this.openAlertDialog(
      "Etes vous sûr d'activer cet utilisateur?",
      Constants.WARNING,
      true,
      Constants.COLOR_WHITE,
      Constants.COLOR_YELLOW,
      Constants.ACTION_ACTIVATE);
  }

  confirmArchiveUser() {
    this.api.getData(Endpoint.ARCHIVE_USER, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0003':
            this.toast.error('Ancie ', { closeButton: true, progressBar: true });
            break;
          case '0000':
            this.toast.success('Utilisateur archivé avec succès.', { closeButton: true, progressBar: true });
            break;
        }
      }
    }, err => {
      this.toast.error("Erreur lors de l'archivage de l'utilisateur.", { closeButton: true, progressBar: true });
    });
  }

  confirmActivateUser() {
    this.api.getData(Endpoint.ACTIVATE_USER, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0003':
            this.toast.error('Ancie ', { closeButton: true, progressBar: true });
            break;
          case '0000':
            this.toast.success('Utilisateur activé avec succès.', { closeButton: true, progressBar: true });
            break;
        }
      }
    }, err => {
      this.toast.error("Erreur lors de l'activation de l'utilisateur.", { closeButton: true, progressBar: true });
    });
  }

  private openAlertDialog(message, title, showAction, color, bg_color, action) {
    const alertDialogRef = this.dialog.open(CustomPopupComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message, title: title, showAction: showAction, color: color, bg_color: bg_color }
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result === Constants.CONFIRM) {
        if (action === Constants.ACTION_DELETE) {
          this.confirmArchiveUser();
        } else if (action === Constants.ACTION_ACTIVATE) {
          this.confirmActivateUser();
        }
      }
    });
  }*/

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}