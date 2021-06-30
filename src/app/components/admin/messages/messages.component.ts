import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
import { AnonymsMessage } from 'src/app/models/anonyms-message.model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ApiService } from 'src/app/api/api.service';
import { MessagePopupComponent } from '../message-popup/message-popup.component';
import * as Endpoint from 'src/app/utils/endpoints';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { HttpParams } from '@angular/common/http';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  resultMessages: any;
  messages: AnonymsMessage[] = [];

  displayedColumns: string[] = ['firstName', 'emailEm', 'objet', 'dateMsg', 'dateLect'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private dialog: MatDialog,
    private toast: ToastService,
    private api: ApiService
  ) {
    this.resultMessages = this.activatedRoute.snapshot.data.value;
    if (this.resultMessages.status && this.resultMessages.status === 401) {
      this.logout();
    } else {
      this.messages = this.resultMessages.content;
      this.dataSource.data = this.messages;
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (!this.resultMessages.status) {
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

  readMessage(message: AnonymsMessage) {
    if (message.etat === 'N') {
      const payload = new HttpParams()
        .set('idMsg', '' + message.idMsg);
      this.api.postData(Endpoint.CHANGE_STATUS_ANONYM_MESSAGE, payload, AuthorizationType.Token).subscribe(res => {
        this.displayMessage(message);
        this.updateStatus(message);
      }, err => {
        if (err.status === 401) {
          this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
          this.logout();
          return;
        }
      });
    } else {
      this.displayMessage(message);
    }
  }

  updateStatus(message) {
    let index = this.messages.findIndex(item => item.idMsg === message.idMsg);
    if (index !== -1) {
      this.messages[index].etat = 'L';
    }
    this.dataSource.data = this.messages;
  }

  displayMessage(message: AnonymsMessage) {
    const alertDialogRef = this.dialog.open(MessagePopupComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message }
    });
    alertDialogRef.afterClosed().subscribe(result => {

    });
  }

}
