import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { MustMatch } from 'src/app/utils/must-match';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from 'src/app/utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo } from 'src/app/models/user-info.model';
import { ToastService } from 'src/app/utils/toast.service';
import { HttpParams } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.css']
})
export class EditPasswordComponent implements OnInit {

  resetForm: FormGroup;
  userInfo: UserInfo;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private toast: ToastService,
    private routerOutlet: RouterOutlet,
    private router: Router
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
            this.router.navigate(['/praticien']);
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
