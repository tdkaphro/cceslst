import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo } from 'src/app/models/user-info.model';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/api/api.service';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { HeaderResponse } from 'src/app/models/header-response.model';
import * as Endpoint from 'src/app/utils/endpoints';
import { ToastService } from 'src/app/utils/toast.service';
import { TraitementComments } from 'src/app/models/traitement-comments.model';

@Component({
  selector: 'app-traitement-messages-popup',
  templateUrl: './traitement-messages-popup.component.html',
  styleUrls: ['./traitement-messages-popup.component.css']
})
export class TraitementMessagesPopupComponent implements OnInit, AfterViewChecked {

  messages: TraitementComments[] = [];
  currentUser: UserInfo;
  idTraitement: any;

  text: string = '';

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  constructor(
    private dialogRef: MatDialogRef<TraitementMessagesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private api: ApiService,
    private toast: ToastService
  ) {
    this.messages = data.messages;
    this.idTraitement = data.idTraitement;
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  onSubmit() {
    this.sendMessage(this.text);
  }

  sendMessage(message) {
    const payload = new HttpParams()
      .set('commentaire', message)
      .set('login', this.currentUser.login)
      .set('idTraitement', '' + this.idTraitement);

    this.api.postData(Endpoint.TRAITEMENT_ADD_MESSAGES, payload, AuthorizationType.Token).subscribe(res => {
      let headerResponse: HeaderResponse = res;
      if (headerResponse.resultCode === '0002') {
      } else if (headerResponse.resultCode === '0000') {
        this.messages.push({ login: this.currentUser.login, commentaire: message, dateCommentaire: '' + new Date(), idTraitement: this.idTraitement });
        this.text = '';
      } else if (headerResponse.resultCode === '0003') {
        this.toast.error(headerResponse.resultMsg, { closeButton: true, progressBar: true });
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.dialogRef.close();
        return;
      }
      this.toast.error("Erreur lors de l'envoie du message.", { closeButton: true, progressBar: true });
    });
  }

}
