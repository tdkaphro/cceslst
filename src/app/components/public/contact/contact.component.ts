import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/utils/toast.service';
import { ApiService } from 'src/app/api/api.service';
import { HttpParams } from '@angular/common/http';
import * as Endpoint from '../../../utils/endpoints'
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService, private toast: ToastService) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    const payload = new HttpParams()
    .set('email', this.f.email.value)
    .set('firstName', this.f.firstname.value)
    .set('lastName', this.f.lastname.value)
    .set('object', this.f.subject.value)
    .set('message', this.f.message.value);

    this.api.postData(Endpoint.CONTACT, payload, AuthorizationType.Empty).subscribe(res => {
      this.toast.success('Nous avons bien reçu votre message.', { closeButton: true, progressBar: true });
    }, err => {
      //console.log(err)
      this.toast.error("Erreur lors de l'envoie du message.", { closeButton: true, progressBar: true });
    });
  }

}
