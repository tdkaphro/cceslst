import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MustMatch } from 'src/app/utils/must-match';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { UserInfo } from 'src/app/models/user-info.model';
import { HttpParams } from '@angular/common/http';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import * as Endpoint from 'src/app/utils/endpoints';
import { ApiService } from 'src/app/api/api.service';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  specialties = [{ value: 'O', valueView: 'Orthodontiste' }, { value: 'D', valueView: 'Dentiste' }]
  sexes = [{ value: 'H', valueView: 'Homme' }, { value: 'F', valueView: 'Femme' }];
  userInfo: UserInfo;

  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routerOutlet: RouterOutlet,
    private api: ApiService,
    private toast: ToastService
  ) {
    let result = this.activatedRoute.snapshot.data.value;
    if (result.status && result.status === 401) {
      this.logout();
    } else {
      this.userInfo = result.content;
    }
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      username: ['', Validators.required],
      specialite: ['', Validators.required],
      cabinet: ['', Validators.required],
      matricule: ['', Validators.required],
      address: ['', Validators.required],
      code_postale: ['', Validators.required],
      ville: ['', Validators.required],
      phone: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.initProfile();
  }

  initProfile() {
    this.fprofile.nom.setValue(this.userInfo.nom);
    this.fprofile.prenom.setValue(this.userInfo.prenom);
    this.fprofile.username.setValue(this.userInfo.login);
    this.fprofile.specialite.setValue(this.userInfo.type);
    this.fprofile.cabinet.setValue(this.userInfo.cabinet);
    this.fprofile.matricule.setValue(this.userInfo.matriculeFiscal);
    this.fprofile.address.setValue(this.userInfo.adresse);
    this.fprofile.code_postale.setValue(this.userInfo.codePostal);
    this.fprofile.ville.setValue(this.userInfo.ville);
    this.fprofile.phone.setValue(this.userInfo.telFixe);
    this.fprofile.mobile.setValue(this.userInfo.telPortable);
    this.fprofile.email.setValue(this.userInfo.email);
  }

  get fprofile() { return this.profileForm.controls; }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    const payload = new HttpParams()
      .set('nom', this.fprofile.nom.value)
      .set('prenom', this.fprofile.prenom.value)
      .set('login', this.fprofile.username.value.toLowerCase())
      .set('email', this.fprofile.email.value)
      .set('sexe', 'H')

      .set('type', this.fprofile.specialite.value)
      .set('cabinet', this.fprofile.cabinet.value)
      .set('matriculeFiscal', this.fprofile.matricule.value)
      .set('adresse', this.fprofile.address.value)
      .set('codePostal', this.fprofile.code_postale.value)
      .set('ville', this.fprofile.ville.value)
      .set('telFixe', this.fprofile.phone.value)
      .set('telPortable', this.fprofile.mobile.value);

    this.api.postData(Endpoint.UPDATE_USER_INFO, payload, AuthorizationType.Token).subscribe(res => {
      switch (res.resultCode) {
        case '0000':
          this.toast.success('Votre profil a été bien modifier.', { closeButton: true, progressBar: true });
          break;
        case '0001':
          this.toast.error("Erreur s'est produite lors de la modification du profil.", { closeButton: true, progressBar: true });
          break;
        case '0003':
          this.toast.error("Nom d'utilisateur existe déjà!", { closeButton: true, progressBar: true });
          break;
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
      this.toast.error("Erreur s'est produite lors de la modification du profil.", { closeButton: true, progressBar: true });
    });
  }

}
