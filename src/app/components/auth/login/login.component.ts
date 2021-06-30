import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { HttpParams } from '@angular/common/http';
import * as Endpoint from '../../../utils/endpoints'
import { Router, RouterOutlet } from '@angular/router';
import { ForgotPasswordPopupComponent } from '../forgot-password-popup/forgot-password-popup.component';
import { MatDialog } from '@angular/material';
import { AuthTokenResponse } from 'src/app/models/auth-token-response.model';
import { UserInfo } from 'src/app/models/user-info.model';
import { HeaderResponse } from 'src/app/models/header-response.model';
import { Role } from 'src/app/models/enum/role.enum';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private routerOutlet: RouterOutlet,
    private api: ApiService, private toast: ToastService, private dialog: MatDialog) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const payload = new HttpParams()
      .set('username', this.f.email.value.toLowerCase())
      .set('password', this.f.password.value)
      .set('grant_type', 'password')
      .set('client_id', 'app_client');
    this.api.postData(Endpoint.LOGIN, payload, AuthorizationType.Basic).subscribe(res => {
      this.loadUserInfo(res, this.f.email.value.toLowerCase());
    }, err => {
      if (err.error.error === 'invalid_grant')
        if (err.error.error_description === 'Bad credentials')
          this.toast.error("Login ou mot de passe invalide!", { closeButton: true, progressBar: true });
        else if (err.error.error_description === 'User is disabled')
          this.toast.error("Votre compte est inactif, veuillez contacter l'administrateur pour l'activer.", { closeButton: true, progressBar: true });
        else
          this.toast.error("Erreur s'est produite!", { closeButton: true, progressBar: true });
    });
  }

  loadUserInfo(result: AuthTokenResponse, login: string) {
    localStorage.setItem('token_auth', result.token_type + ' ' + result.access_token);
    this.api.getData(Endpoint.INFO_USER + login, AuthorizationType.Token).subscribe(res => {
      let header: HeaderResponse = res.header;
      switch (header.resultCode) {
        case '0000':
          let result: UserInfo = res.content;
          result.login = result.login.toLowerCase();
          localStorage.setItem('user_data', JSON.stringify(result));
          //this.routerOutlet.deactivate();
          if (result.profil.role === Role.Admin) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/praticien']);
          }
          break;
      }
    }, err => {
      this.toast.error("erruer!", { closeButton: true, progressBar: true });
    });
  }

  register() {
    this.router.navigate(['/auth/user/register']);
  }

  forgotPassword() {
    const alertDialogRef = this.dialog.open(ForgotPasswordPopupComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: {}
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

}