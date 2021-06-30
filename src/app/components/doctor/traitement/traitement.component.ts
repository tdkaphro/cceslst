import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as Endpoint from '../../../utils/endpoints';
import { ApiService } from 'src/app/api/api.service';
import { ToastService } from 'src/app/utils/toast.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import * as Constants from '../../../utils/constants';
import { MatDialog } from '@angular/material';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { AuthService } from 'src/app/auth/auth.service';
import { PopupFeedbackComponent } from 'src/app/shared/popup-feedback/popup-feedback.component';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-traitement',
  templateUrl: './traitement.component.html',
  styleUrls: ['./traitement.component.css']
})
export class TraitementComponent implements OnInit {

  isLinear = true;
  isSubmitted = false;
  step3HasError = false;
  isForm3Submitted = false;

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;

  typeDent = [
    { idTypeDent: 18, traitement: 0 }, { idTypeDent: 17, traitement: 0 }, { idTypeDent: 16, traitement: 0 },
    { idTypeDent: 15, traitement: 0 }, { idTypeDent: 14, traitement: 0 }, { idTypeDent: 13, traitement: 0 },
    { idTypeDent: 12, traitement: 0 }, { idTypeDent: 11, traitement: 0 }, { idTypeDent: 21, traitement: 0 },
    { idTypeDent: 22, traitement: 0 }, { idTypeDent: 23, traitement: 0 }, { idTypeDent: 24, traitement: 0 },
    { idTypeDent: 25, traitement: 0 }, { idTypeDent: 26, traitement: 0 }, { idTypeDent: 27, traitement: 0 },
    { idTypeDent: 28, traitement: 0 }, { idTypeDent: 48, traitement: 0 }, { idTypeDent: 47, traitement: 0 },
    { idTypeDent: 46, traitement: 0 }, { idTypeDent: 45, traitement: 0 }, { idTypeDent: 44, traitement: 0 },
    { idTypeDent: 43, traitement: 0 }, { idTypeDent: 42, traitement: 0 }, { idTypeDent: 41, traitement: 0 },
    { idTypeDent: 31, traitement: 0 }, { idTypeDent: 32, traitement: 0 }, { idTypeDent: 33, traitement: 0 },
    { idTypeDent: 34, traitement: 0 }, { idTypeDent: 35, traitement: 0 }, { idTypeDent: 36, traitement: 0 },
    { idTypeDent: 37, traitement: 0 }, { idTypeDent: 38, traitement: 0 }
  ];

  picRadio = [
    { libelle: 'Face sourire', idDocument: 'PHOTO_1', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Profil', idDocument: 'PHOTO_2', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Occlusion fermée vestibulaire', idDocument: 'PHOTO_3', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Occlusion fermée latérale gauche', idDocument: 'PHOTO_4', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Occlusion fermée latérale droite', idDocument: 'PHOTO_5', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Vue occlusale du maxillaire sup', idDocument: 'PHOTO_6', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Vue occlusale de la mandibule', idDocument: 'PHOTO_7', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Radio panoramique', idDocument: 'PHOTO_8', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Inocclusion (De face)', idDocument: 'PHOTO_9', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' },
    { libelle: 'Téléradio (Facultative)', idDocument: 'PHOTO_10', pic: Constants.DEFAULT_IMG, isDefaultImg: true, fileName: '' }
  ]

  coneBeam = { idDocument: 'CONE_BEAM', fileName: '', encodedFile: '' };

  sexes = [{ value: 'H', valueView: 'Homme' }, { value: 'F', valueView: 'Femme' }];
  minDate: Date;
  maxDate: Date;

  traitementTypes = [{ value: 'S', valueView: 'Arcade supérieure' }, { value: 'I', valueView: 'Arcade inférieure' }, { value: 'D', valueView: 'Les deux' }];

  @ViewChild('inputFileImg', { static: true }) inputFileImg: ElementRef;
  @ViewChild('inputFileConeBeam', { static: true }) inputFileConeBeam: ElementRef;
  @ViewChild('inputFileMaxillaire', { static: true }) inputFileMaxillaire: ElementRef;
  @ViewChild('inputFileMandibulaire', { static: true }) inputFileMandibulaire: ElementRef;
  @ViewChild('inputFileOcclusion', { static: true }) inputFileOcclusion: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private toast: ToastService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private auth: AuthService,
    private routerOutlet: RouterOutlet,
    private imageCompress: NgxImageCompressService
  ) {
    let resultTypeDent = this.activatedRoute.snapshot.data.value[0];
    let result = this.activatedRoute.snapshot.data.value[1];
    if ((result && result.status && result.status === 401) || (resultTypeDent && resultTypeDent.status && resultTypeDent.status === 401)) {
      this.logout();
      return;
    }
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 5, 11, 31);
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  ngOnInit() {
    this.step1Form = this.formBuilder.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      sexe: ['', Validators.required],
      birthday: ['', Validators.required]
    });
    this.step2Form = this.formBuilder.group({
      comment: ['', Validators.required],
      traitementType: ['', Validators.required],
      flgExtraction: ['', Validators.required],
      flgEspace: ['', Validators.required],
      flgClasse: ['', Validators.required],
      flgSurplomb: ['', Validators.required],
      flgSupracc: ['', Validators.required],
      flgBeance: ['', Validators.required],
      flgOccIa: ['', Validators.required],
      flgOccIp: ['', Validators.required]
    });
    this.step3Form = this.formBuilder.group({
      photos: ['', Validators.required]
    });
    this.step4Form = this.formBuilder.group({
    });
  }

  get form1() { return this.step1Form.controls; }
  get form2() { return this.step2Form.controls; }
  get form3() { return this.step3Form.controls; }
  get form4() { return this.step4Form.controls; }

  getImageSrc(typeDent) {
    return './assets/img/dents/' + typeDent + '.png';
  }

  onDentClicked(item) {
    if (item.traitement === 4)
      item.traitement = 0;
    else
      item.traitement++;
  }

  onImageSelected(event, item) {
    let fileType = event.target.files[0].type;

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {


        if (fileType != 'image/png' && fileType != 'image/jpeg') {
          this.openAlertDialog(
            'Fichiers acceptés : .png et .jpeg',
            Constants.FAILURE,
            false,
            Constants.COLOR_WHITE,
            Constants.COLOR_RED,
            '',
            '');
          this.inputFileImg.nativeElement.value = '';
          return;
        }

        //item.pic = event.target.result;
        item.isDefaultImg = false;
        this.compressFile(item, event.target.result);
      }
      item.fileName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  compressFile(item, image) {
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        item.pic = result;
        // create file from byte
        const imageName = item.fileName;
        // call method that creates a blob from dataUri
        //const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
        //imageFile created below is the new compressed file which can be send to API in form data
        //const imageFile = new File([result], imageName, { type: 'image/jpeg' });
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  removeImage(item) {
    item.pic = Constants.DEFAULT_IMG;
    item.isDefaultImg = true;
  }

  onConeBeamSelected(event) {
    let fileType = event.target.files[0].type;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        /*if (fileType != 'application/dicom') {
          this.openAlertDialog(
            'Fichiers acceptés : dicom (.dcm)',
            Constants.FAILURE,
            false,
            Constants.COLOR_WHITE,
            Constants.COLOR_RED,
            '',
            '');
          this.inputFileConeBeam.nativeElement.value = '';
          return;
        }*/
        this.coneBeam.encodedFile = event.target.result;
      }
      this.coneBeam.fileName = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private openAlertDialog(message, title, showAction, color, bg_color, action, item) {
    const alertDialogRef = this.dialog.open(PopupFeedbackComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message, title: title, showAction: showAction, color: color, bg_color: bg_color }
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result === Constants.CONFIRM) {
        /*if (action === Constants.ACTION_DELETE) {
          this.confirmDelete(item);
        }*/
      }
    });
  }

  checkStep3() {
    for (let i = 0; i < this.picRadio.length - 1; i++) {
      if (this.picRadio[i].pic === Constants.DEFAULT_IMG) {
        this.isForm3Submitted = true;
        return;
      }
    }
    this.form3.photos.setValue('value');
  }

  onSubmit() {
    var d = new Date(this.form1.birthday.value)
    let birthday = [d.getFullYear(), d.getMonth() + 1, d.getDate()];

    let traitement = {
      login: this.auth.getCurrentUser().login,
      nomPatient: this.form1.nom.value,
      prenomPatient: this.form1.prenom.value,
      sexePatient: this.form1.sexe.value,
      typeTraitement: this.form2.traitementType.value,
      flgOccIp: this.form2.flgOccIp.value,
      flgOccIa: this.form2.flgOccIa.value,
      flgBeance: this.form2.flgBeance.value,
      flgSupracc: this.form2.flgSupracc.value,
      flgSurplomb: this.form2.flgSurplomb.value,
      flgClasse: this.form2.flgClasse.value,
      flgEspace: this.form2.flgEspace.value,
      flgExtraction: this.form2.flgExtraction.value,
      commentaires: this.form2.comment.value,
      dateNaissancePatient: birthday
    };

    let traitementDocument = [];

    this.picRadio.forEach(element => {
      if (element.pic !== Constants.DEFAULT_IMG)
        traitementDocument.push({ idDocument: element.idDocument, fileName: element.fileName, encodedFile: element.pic });
    });

    if (this.coneBeam.encodedFile !== '')
      traitementDocument.push({ idDocument: this.coneBeam.idDocument, fileName: this.coneBeam.fileName, encodedFile: this.coneBeam.encodedFile });

    const payload = {
      traitement: traitement,
      traitementTypeDent: this.typeDent,
      traitementDocument: traitementDocument,
    };

    this.api.postData(Endpoint.ADD_TRAITEMENT, payload, AuthorizationType.Token).subscribe(res => {
      console.log(res, "hey");
      switch (res.resultCode) {
        case '0000':
          this.toast.success('Votre traitement a été bien enregisté.', { closeButton: true, progressBar: true });

          this.router.navigate(['praticien']);
          this.api.postData(Endpoint.SEND_EMAIL, parseInt(res.resultMsg), AuthorizationType.Token).subscribe(res => {

          })
          //this.router.navigate(['/auth/user/login']);
          break;
        case '0001':
          this.toast.error("Erreur s'est produite lors de la création du traitement.", { closeButton: true, progressBar: true });
          break;
        case '0003':
          this.toast.error('Erreur au niveau renseignement des documents : tous les documents obligatoires doivent etre envoyés', { closeButton: true, progressBar: true });
          break;
      }
    }, err => {
      //console.log(err);
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
      this.toast.error("Erreur s'est produite lors de la création du traitement.", { closeButton: true, progressBar: true });
    });
  }

}
