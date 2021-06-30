import { MustMatch } from 'src/app/utils/must-match';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { HttpParams } from '@angular/common/http';
import * as Endpoint from '../../../utils/endpoints'
import { Router, RouterOutlet } from '@angular/router';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  contactForm: FormGroup;
  infoForm: FormGroup;
  specialties = [{ value: 'O', valueView: 'Orthodontiste' }, { value: 'D', valueView: 'Dentiste' }]
  sexes = [{ value: 'H', valueView: 'Homme' }, { value: 'F', valueView: 'Femme' }];

  hide = true;

  isLinear = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private api: ApiService,
    private toast: ToastService
  ) { }

  ngOnInit() {
    this.infoForm = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      username: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      conf_password: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'conf_password')
    });

    this.contactForm = this.formBuilder.group({
      specialite: ['', Validators.required],
      cabinet: ['', Validators.required],
      matricule: ['', Validators.required],

      address: ['', Validators.required],
      code_postale: ['', Validators.required],
      ville: ['', Validators.required],

      phone: ['', Validators.required],
      mobile: ['', Validators.required],
    });
  }

  get fInfo() { return this.infoForm.controls; }
  get fContact() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    const payload = new HttpParams()
      .set('nom', this.fInfo.nom.value)
      .set('prenom', this.fInfo.prenom.value)
      .set('login', this.fInfo.username.value.toLowerCase())
      .set('email', this.fInfo.email.value)
      .set('password', this.fInfo.password.value)
      .set('sexe', 'H')

      .set('type', this.fContact.specialite.value)
      .set('cabinet', this.fContact.cabinet.value)
      .set('matriculeFiscal', this.fContact.matricule.value)
      .set('adresse', this.fContact.address.value)
      .set('codePostal', this.fContact.code_postale.value)
      .set('ville', this.fContact.ville.value)
      .set('telFixe', this.fContact.phone.value)
      .set('telPortable', this.fContact.mobile.value);

    this.api.postData(Endpoint.REGISTER, payload, AuthorizationType.Empty).subscribe(res => {
      switch (res.resultCode) {
        case '0000':
          this.toast.success('Félicitations! votre inscription a été effectuée avec succès. Vous recevrez un email d\'activation dès que votre compte sera validé par l\'administrateur.', { closeButton: true, progressBar: true });
          this.router.navigate(['/auth/user/login']);
          break;
        case '0001':
          this.toast.error("Erreur s'est produite lors de la création du compte.", { closeButton: true, progressBar: true });
          break;
        case '0003':
          this.toast.error("Nom d'utilisateur existe déjà!", { closeButton: true, progressBar: true });
          break;
      }
    }, err => {
      this.toast.error("Erreur s'est produite lors de la création du compte.", { closeButton: true, progressBar: true });
    });
  }

  login() {
    this.router.navigate(['/auth/user/login']);
  }

}
