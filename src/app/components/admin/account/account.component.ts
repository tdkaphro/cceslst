import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { MustMatch } from 'src/app/utils/must-match';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo } from 'src/app/models/user-info.model';
import * as Endpoint from 'src/app/utils/endpoints';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  resetForm: FormGroup;
  userInfo: UserInfo;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toast: ToastService,
    private routerOutlet: RouterOutlet,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.userInfo = this.auth.getCurrentUser();
    this.resetForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confPassword')
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    const data = new HttpParams()
      .set('ancienPassword', '' + this.f.oldPassword.value)
      .set('nouveauPassword', '' + this.f.password.value)
      .set('login', '' + this.userInfo.login);

    this.api.postData(Endpoint.UPDATE_USER_PASSWORD, data, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0003':
            this.toast.error('Ancien mot de passe erroné!', { closeButton: true, progressBar: true });
            break;
          case '0000':
            this.toast.success('Mot de passe modifié avec succès!', { closeButton: true, progressBar: true });
            this.router.navigate(['/admin']);
            break;
        }
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
      this.toast.error('Erreur lors de la modification du mot de passe!', { closeButton: true, progressBar: true });
    });
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

}
