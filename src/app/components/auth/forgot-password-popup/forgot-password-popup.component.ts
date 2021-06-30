import { HeaderResponse } from './../../../models/header-response.model';
import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { HttpParams } from '@angular/common/http';
import * as Endpoint from '../../../utils/endpoints'
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';

@Component({
  selector: 'app-forgot-password-popup',
  templateUrl: './forgot-password-popup.component.html',
  styleUrls: ['./forgot-password-popup.component.css']
})
export class ForgotPasswordPopupComponent implements OnInit {

  emailForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<ForgotPasswordPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder, private api: ApiService, private toast: ToastService) {
  }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]]
    });
  }

  get f() { return this.emailForm.controls; }

  onSubmit() {
    // stop here if form is invalid
    if (this.emailForm.invalid) {
      return;
    }
    this.sendEmail(this.f.email.value, this.f.username.value);
  }

  sendEmail(email, username) {
    const payload = new HttpParams()
      .set('email', email)
      .set('login', username.toLowerCase());

    this.api.postData(Endpoint.FORGOT_PASSWORD, payload, AuthorizationType.Empty).subscribe(res => {
      let headerResponse: HeaderResponse = res;
      if (headerResponse.resultCode === '0002') {
        this.toast.error("Login ou email invalide!", { closeButton: true, progressBar: true });
      } else if (headerResponse.resultCode === '0000') {
        this.toast.success('Un email de récupération de mot de passe a été envoyé!', { closeButton: true, progressBar: true });
        this.onCloseConfirm('success');
      }
    }, err => {
      this.toast.error("Erreur lors de l'envoie de l'email.", { closeButton: true, progressBar: true });
    });
  }

  onCloseConfirm(value) {
    this.dialogRef.close({ result: value });
  }

}
