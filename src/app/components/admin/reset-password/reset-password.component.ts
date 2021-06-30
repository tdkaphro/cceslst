import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { MustMatch } from 'src/app/utils/must-match';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;

  isTokenValid = false;
  isServerRespond = false;

  hide = true;

  token: String;

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

    /*const payload = new HttpParams()
    .set('token', this.token);

    this.api.postData(Endpoint.VERIFY_PRATICIEN_TOKEN, payload).subscribe(res => {
      this.isServerRespond = true;
      if (res.status === 1){
        this.isTokenValid=true;
        this.toast.success('Token valid.', { closeButton: true, progressBar: true })
      }else if (res.status === 0){
        this.isTokenValid=false;
        this.toast.error("Token invalid.", { closeButton: true, progressBar: true });
      }
    }, err => {
      this.toast.error("Erreur lors de l'envoie du message.", { closeButton: true, progressBar: true });
    });*/
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    /*const payload = new HttpParams()
    .set('password', this.f.password.value)
    .set('confPassword', this.f.confPassword.value);

    this.api.postData(Endpoint.CONTACT, payload).subscribe(res => {
      this.toast.success('Nous avons bien reçu votre message.', { closeButton: true, progressBar: true });
    }, err => {
      this.toast.error("Erreur lors de l'envoie du message.", { closeButton: true, progressBar: true });
    });*/
    this.router.navigate(['/auth/user/login']);
  }

}
