import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { TraitementHistory } from 'src/app/models/traitement-history.model';
import { UserInfo } from 'src/app/models/user-info.model';
import { TraitementDetails } from 'src/app/models/traitement-details.model';
import { HelperService } from 'src/app/utils/helper.service';
import { MatDialog } from '@angular/material';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from 'src/app/utils/endpoints';
import * as Constants from 'src/app/utils/constants';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { HttpParams } from '@angular/common/http';
import { TraitementPhotos } from 'src/app/models/traitement-photos.model';
import { PossibleTransition } from 'src/app/models/possible-transition.model';
import { HeaderResponse } from 'src/app/models/header-response.model';
import { PossibleActions } from 'src/app/models/possible-actions.model';
import { ToastService } from 'src/app/utils/toast.service';
import { Location } from '@angular/common';
import { TraitementDocument } from 'src/app/models/traitement-document.model';
import { PhotoPlayerComponent } from '../../../shared/photo-player/photo-player.component';
import { TraitementMessagesPopupComponent } from '../../../shared/traitement-messages-popup/traitement-messages-popup.component';
import { PopupFeedbackComponent } from 'src/app/shared/popup-feedback/popup-feedback.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-traitement-details',
  templateUrl: './traitement-details.component.html',
  styleUrls: ['./traitement-details.component.css']
})
export class TraitementDetailsComponent implements OnInit {

  @ViewChild('inputFile', { read: undefined, static: false }) inputFile: ElementRef;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[] = [];

  isOkay = false;
  historyResult: any;
  traitementResult: any;
  photosResult: any;
  history: TraitementHistory[] = [];
  userInfo: UserInfo;
  traitementDetails: TraitementDetails;
  traitementPhotos: TraitementPhotos[] = [];
  possibleTransition: PossibleTransition[] = [];
  possibleActions: PossibleActions[] = [];
  selectedItem: PossibleActions;
  traitementPlanVideos: TraitementDocument[] = [];
  traitementPlanPDF: TraitementDocument[] = [];
  traitementPlanPhotos: TraitementDocument[] = [];
  tmpPlanTrt = [];
  hidePhotos = true;
  hidePlanTrt = false;
  btnTrtTitle = 'Cacher le plan de traitement';
  btnPhotosTitle = 'Afficher les Images';

  minDate: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet,
    public helperService: HelperService,
    private dialog: MatDialog,
    private api: ApiService,
    private toast: ToastService,
    private location: Location
  ) {

    this.minDate = new Date();
  }

  ngOnInit() {
    this.galleryOptions = [

      {
        imageAnimation: NgxGalleryAnimation.Slide

      },
      // max-width 800
      { "imageDescription": true },
      // max-width 400
      {

        "image": false, "thumbnailsRows": 2, "thumbnailsColumns": 5, "previewZoom": true, "previewRotate": true, "width": '95%', "previewFullscreen": true,

      },



    ];

    this.activatedRoute.params.subscribe((params: Params) => {
      this.historyResult = this.activatedRoute.snapshot.data.value[0];
      this.traitementResult = this.activatedRoute.snapshot.data.value[1];
      this.photosResult = this.activatedRoute.snapshot.data.value[2];

      if (this.historyResult && this.traitementResult) {
        this.history = this.historyResult.content;
        this.refactorTraitementDetails(this.traitementResult.content);
        this.cleanTraitementDocs();
        this.userInfo = this.traitementDetails.userCre;
        this.isOkay = true;
        this.loadPossibleTransition('');
        const sourcePage = this.helperService.getPageSource();
        if (sourcePage === 'message') {
          this.loadMessages();
          this.helperService.setPageSource('');
        }
      } else {
        this.logout();
      }
    });
  }

  handleTrtVisibility() {
    this.hidePlanTrt = !this.hidePlanTrt;
    this.hidePlanTrt ? this.btnTrtTitle = 'Afficher le plan de traitement' : this.btnTrtTitle = 'Cacher le plan de traitement';
  }

  onBackButtonClicked() {
    this.location.back();
  }

  refactorTraitementDetails(traitement: TraitementDetails) {
    traitement.typeTraitement = this.helperService.getTypeTraitement(traitement.typeTraitement);
    traitement.flgBeance = this.helperService.getStatus(traitement.flgBeance);
    traitement.flgClasse = this.helperService.getStatus(traitement.flgClasse);
    traitement.flgEspace = this.helperService.getStatus(traitement.flgEspace);
    traitement.flgExtraction = this.helperService.getStatus(traitement.flgExtraction);
    traitement.flgOccIa = this.helperService.getStatus(traitement.flgOccIa);
    traitement.flgOccIp = this.helperService.getStatus(traitement.flgOccIp);
    traitement.flgSupracc = this.helperService.getStatus(traitement.flgSupracc);
    traitement.flgSurplomb = this.helperService.getStatus(traitement.flgSurplomb);
    var d1 = new Date(traitement.dateNaissancePatient);
    var d2 = new Date();
    var diff = new Date(d2.getTime() - d1.getTime());
    // diff is: Thu Jul 05 1973 04:00:00 GMT+0300 (EEST)
    traitement.patientAge = diff.getUTCFullYear() - 1970;
    this.traitementDetails = traitement;
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  downloadPhotos() {
    if (this.hidePhotos) {
      if (this.traitementPhotos.length > 0) {
        this.btnPhotosTitle = 'Cacher les photos';
        this.hidePhotos = false;
      } else {
        const payloadPhotos = new HttpParams().set('idTraitement', '' + this.traitementDetails.idTraitement).set('categDoc', 'PHOTO');
        this.api.postData(Endpoint.TRAITEMENT_PHOTOS, payloadPhotos, AuthorizationType.Token).subscribe(res => {
          if (res.header) {
            if (res.header.resultCode === '0000') {
              let image = null
              let description = null

              let item = null
              this.traitementPhotos = res.content;
              this.btnPhotosTitle = 'Cacher les photos';
              this.hidePhotos = false;
              this.traitementPhotos.forEach(element => {
                image = this.helperService.refactorImg(element.encodedFile)
                description = this.helperService.getLibelPhoto(element.idDocument)
                item = {
                  description: description,
                  small: image,
                  medium: image,
                  big: image
                }
                this.galleryImages.push(item)

              });
            }
          }
        }, err => {
          if (err.status === 401) {
            this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
            this.logout();
            return;
          }
        });
      }
    } else {
      this.btnPhotosTitle = 'Afficher les photos';
      this.hidePhotos = true;
    }
  }

  getDents(traitementDent) {
    let count = 0;
    for (let dent of this.traitementDetails.listTraitementTypeDent) {
      if (dent.traitement === traitementDent)
        count++;
    }
    return count === 0 ? 'Aucun(e)' : '' + count;
  }

  openPhoto(photo, traitementPhotos) {
    let photos = []
    let ids = []
    traitementPhotos.forEach(element => {
      element.id = this.helperService.getLibelPhoto(element.idDocument)

      photos.push(this.helperService.refactorImg(element.encodedFile))
    });
    const alertDialogRef = this.dialog.open(PhotoPlayerComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { photos: photos, libelle: this.helperService.getLibelPhoto(photo.idDocument) }
    });
    alertDialogRef.afterClosed().subscribe(result => {

    });
  }

  showMessages(messages) {
    const alertDialogRef = this.dialog.open(TraitementMessagesPopupComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { messages: messages, idTraitement: this.traitementDetails.idTraitement }
    });
    alertDialogRef.afterClosed().subscribe(result => {

    });
  }

  loadMessages() {
    const payload = new HttpParams()
      .set('idTraitement', '' + this.traitementDetails.idTraitement)
      .set('login', this.userInfo.login);
    this.api.postData(Endpoint.TRAITEMENT_MESSAGES, payload, AuthorizationType.Token).subscribe(res => {
      //console.log(res)
      this.showMessages(res.content);
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  private openAlertDialog(message, title, showAction, color, bg_color, action, data) {
    const alertDialogRef = this.dialog.open(PopupFeedbackComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { message: message, title: title, showAction: showAction, color: color, bg_color: bg_color }
    });
    alertDialogRef.afterClosed().subscribe(result => {
      if (result === Constants.CONFIRM) {
        if (action === Constants.ACTION_ADD_SCAN) {
          this.uploadFileToServer(data);
        } else if (action === Constants.ACTION_ACCEPT) {
          this.changeStatus(data.etapeCible.idEtape);
        }
      }
    });
  }

  downloadPlanTraitementFile(idDocument: number, fileName: string, fileType: string) {
    let item = this.tmpPlanTrt.find(item => item.idDocument === idDocument);
    if (item) {
      if (item.fileType === 'pic') {
        this.openPhotoTRTPlan(item.encodedFile);
      } else {
        this.displayFile(item.url);
      }
    } else {
      const payload = new HttpParams()
        .set('idTraitementDocument', '' + idDocument);
      this.api.postData(Endpoint.DOWNLOAD_DOCUMENT_BY_ID, payload, AuthorizationType.Token).subscribe(res => {
        if (fileType === 'pic') {
          this.tmpPlanTrt.push({ idDocument: idDocument, encodedFile: res.content, fileType: fileType });
          this.openPhotoTRTPlan(res.content);
        }
        else {
          this.openFile(res.content, fileName, idDocument, fileType);
        }
      }, err => {
        if (err.status === 401) {
          this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
          this.logout();
          return;
        }
      });
    }
  }

  openFile(encodedFile, fileName, idDocument, fileType) {
    fetch(encodedFile)
      .then(res => res.blob())
      .then(res => {
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        this.tmpPlanTrt.push({ idDocument: idDocument, fileName: fileName, url: link.href, fileType: fileType });
        this.displayFile(link.href);
      });
  }

  displayFile(url) {
    window.open(url);
  }

  openPhotoTRTPlan(encodedFile) {
    this.dialog.open(PhotoPlayerComponent, {
      disableClose: true,
      panelClass: 'custom-dialog',
      data: { photo: this.helperService.refactorImg(encodedFile), libelle: 'Plan de traitement' }
    });
  }

  downloadFile(idDocument: string) {
    const payload = new HttpParams()
      .set('idDocument', idDocument)
      .set('idTraitement', '' + this.traitementDetails.idTraitement);
    this.api.postData(Endpoint.DOWNLOAD_DOCUMENT, payload, AuthorizationType.Token).subscribe(res => {
      this.saveFile(res.content[0].encodedFile, res.content[0].fileName);
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  saveFile(encodedFile, fileName) {
    fetch(encodedFile)
      .then(res => res.blob())
      .then(res => {
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        link.click();
      });
  }

  openPDF(encodedFile, fileName) {
    fetch(encodedFile)
      .then(res => res.blob())
      .then(res => {
        var downloadURL = window.URL.createObjectURL(res);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = fileName;
        window.open(link.href);
      });
  }

  cleanTraitementDocs() {
    let result = [];
    for (let doc of this.traitementDetails.listTraitementDocument) {
      if (!doc.idDocument.includes('PHOTO_') && doc.idDocument !== 'PLAN_TRT')
        result.push(doc);
      if (doc.idDocument === 'PLAN_TRT' && doc.mimeType.toLowerCase() === 'application/pdf')
        this.traitementPlanPDF.push(doc);

      if (doc.idDocument === 'PLAN_TRT' && doc.mimeType.toLowerCase() === 'video/mp4')
        this.traitementPlanVideos.push(doc);

      if (doc.idDocument === 'PLAN_TRT' && doc.mimeType.toLowerCase() !== 'video/mp4' && doc.mimeType.toLowerCase() !== 'application/pdf')
        this.traitementPlanPhotos.push(doc);



    }
    this.traitementDetails.listTraitementDocument = result;
  }

  downloadPlanTraitement(item: TraitementHistory) {
    this.saveFile(item.encodedFile, item.fileNameOrigin);
  }

  onBtnStatusClicked(item: PossibleTransition) {
    if (item.nomTransition === 'Accepter plan de traitement') {
      this.openAlertDialog(
        "Vous venez de valider le plan de traitement, nous allons passer à la production des gouttières. Êtes vous sûrs de continuer ?",
        Constants.CONFIRMATION,
        true,
        Constants.COLOR_BLACK,
        Constants.COLOR_YELLOW,
        Constants.ACTION_ACCEPT,
        item);
    } else {
      this.changeStatus(item.etapeCible.idEtape);
    }
  }

  changeStatus(idEtap) {
    const payload: any = {
      idTraitement: this.traitementDetails.idTraitement,
      idEtape: idEtap,
      login: this.userInfo.login
    };
    this.api.postData(Endpoint.CHANGE_TRAITEMENT_STATUS, payload, AuthorizationType.Token).subscribe(res => {
      if (res.resultCode === '0000') {
        this.reloadHistory();
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  reloadHistory() {
    this.api.getData(Endpoint.TRAITEMENT_HISTORY + this.traitementDetails.idTraitement, AuthorizationType.Token).subscribe(res => {
      let header: HeaderResponse;
      header = res.header;
      if (header.resultCode === '0000') {
        this.history = res.content;
        this.loadPossibleTransition('reload');
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  loadPossibleTransition(source: string) {
    const payload = new HttpParams()
      .set('idEtape', '' + this.history[0].etape.idEtape)
      .set('login', this.userInfo.login);
    this.api.postData(Endpoint.GET_POSSIBLE_TRANSITION, payload, AuthorizationType.Token).subscribe(res => {
      let header: HeaderResponse;
      header = res.header;
      if (header.resultCode === '0000') {
        this.possibleTransition = res.content;
      }
      this.loadPossibleActions();
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  loadPossibleActions() {
    const payload = new HttpParams()
      .set('idEtape', '' + this.history[0].etape.idEtape)
      .set('login', this.userInfo.login);
    this.api.postData(Endpoint.POSSIBLE_ACTIONS, payload, AuthorizationType.Token).subscribe(res => {
      let header: HeaderResponse;
      header = res.header;
      if (header.resultCode === '0000') {
        this.filterPossibleActions(res.content);
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
    });
  }

  uploadFile(item: PossibleActions) {
    this.selectedItem = item;
    this.inputFile.nativeElement.click();
  }

  onFileSelected(event1) {
    if (event1.target.files && event1.target.files[0]) {
      let encodedFile: any;
      var reader = new FileReader();
      reader.onload = (event: any) => {
        encodedFile = event.target.result;
        let fileName = event1.target.files[0].name;
        const data = {
          idTraitement: this.traitementDetails.idTraitement,
          fileName: fileName,
          encodedFile: encodedFile,
          login: this.userInfo.login,
          idDocument: this.selectedItem.typeDocument.idDocument
        };
        this.openAlertDialog(
          "Etes-vous sûr d'envoyer ce fichier?\nFichier sélectionné: " + fileName,
          Constants.CONFIRMATION,
          true,
          Constants.COLOR_BLACK,
          Constants.COLOR_YELLOW,
          Constants.ACTION_ADD_SCAN,
          data);
      }
      reader.readAsDataURL(event1.target.files[0]);

    }
  }

  uploadFileToServer(data: any) {
    this.api.postData(Endpoint.PERFORM_ACTION, data, AuthorizationType.Token).subscribe(res => {
      if (res.resultCode === '0000') {
        this.traitementDetails.listTraitementDocument.push({ idDocument: data.idDocument, idTraitement: data.idTraitement });
        this.filterPossibleActions(this.possibleActions);
        this.toast.success('Fichier importé avec succès!', { closeButton: true, progressBar: true });
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
        return;
      }
      this.toast.error('Erreur lors de l\'importation du fichier!', { closeButton: true, progressBar: true });
    });
  }

  filterPossibleActions(items: PossibleActions[]) {
    this.possibleActions = items;
    this.traitementDetails.listTraitementDocument.forEach(element => {
      this.possibleActions = this.possibleActions.filter(item => item.typeDocument.idDocument !== element.idDocument);
    });
  }

  /*getFilesByType(fileType: string) {
    let result = [];
    for (let _file of this.traitementPlan) {
      if (fileType === _file.mimeType)
        result.push(_file);
    }
    return result;
  }*/

}
