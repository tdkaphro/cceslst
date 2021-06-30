import { MustMatch } from 'src/app/utils/must-match';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserInfo } from 'src/app/models/user-info.model';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpParams } from '@angular/common/http';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import * as Endpoint from 'src/app/utils/endpoints';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

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
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
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
      .set('login', '' + this.f.username.value.toLowerCase())
      .set('password', '' + this.f.password.value)
      .set('nom', '' + this.f.nom.value)
      .set('prenom', '' + this.f.prenom.value)
      .set('email', '' + this.f.email.value);

    this.api.postData(Endpoint.ADD_ADMIN, data, AuthorizationType.Token).subscribe(res => {
      if (res) {
        switch (res.resultCode) {
          case '0003':
            this.toast.error(res.resultMsg, { closeButton: true, progressBar: true });
            break;
          case '0000':
            this.toast.success('Nouveau admin ajouté avec succès!', { closeButton: true, progressBar: true });
            this.router.navigate(['/admin/main/admins']);
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
