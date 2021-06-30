import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { MustMatch } from 'src/app/utils/must-match';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import * as Endpoint from '../../../utils/endpoints';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;

  hide = true;

  token: string;

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private api: ApiService, private toast: ToastService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });

    this.resetForm = this.formBuilder.group({
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
    const payload = new HttpParams()
      .set('token', encodeURIComponent(this.token))
      .set('nouveauPassword', this.f.password.value);

    this.api.postData(Endpoint.RESET_PASSWORD, payload, AuthorizationType.Empty).subscribe(res => {
      switch (res.resultCode) {
        case '0000':
          this.toast.success('Votre mot de passe a été modifié avec succès!', { closeButton: true, progressBar: true });
          this.router.navigate(['/auth/user/login']);
          break;
        case '0003':
          this.toast.error('Token invalide!', { closeButton: true, progressBar: true });
          break;
        default:
          this.toast.error('Token expiré!', { closeButton: true, progressBar: true });
          break;
      }
    }, err => {
      this.toast.error("Erreur lors de la modification du mot de passe.", { closeButton: true, progressBar: true });
    });
  }

}
