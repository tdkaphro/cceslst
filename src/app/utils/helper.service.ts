import { Injectable } from '@angular/core';
import { Event } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private routerEvent: Event;
  private pageSource: string;

  picRadio = [
    { libelle: 'Face sourire', idDocument: 'PHOTO_1' },
    { libelle: 'Profil', idDocument: 'PHOTO_2' },
    { libelle: 'Occlusion fermée vestibulaire', idDocument: 'PHOTO_3' },
    { libelle: 'Occlusion fermée latérale gauche', idDocument: 'PHOTO_4' },
    { libelle: 'Occlusion fermée latérale droite', idDocument: 'PHOTO_5' },
    { libelle: 'Vue occlusale du maxillaire sup', idDocument: 'PHOTO_6' },
    { libelle: 'Vue occlusale de la mandibule', idDocument: 'PHOTO_7' },
    { libelle: 'Radio panoramique', idDocument: 'PHOTO_8' },
    { libelle: 'Inocclusion (De face)', idDocument: 'PHOTO_9' },
    { libelle: 'Téléradio (Facultative)', idDocument: 'PHOTO_10' }
  ];

  documents = [
    { libelle: 'Empreinte maxillaire', idDocument: 'EMP_MAX' },
    { libelle: 'Empreinte mandibulaire', idDocument: 'EMP_MAN' },
    { libelle: 'Empreinte occlusion', idDocument: 'EMP_OCC' },
    { libelle: 'CONE BEAM', idDocument: 'CONE_BEAM' }
  ];

  constructor() { }

  setRouterEvent(routerEvent: Event) {
    this.routerEvent = routerEvent;
  }

  getRouterEvent() {
    return this.routerEvent;
  }

  setPageSource(pageSource: string) {
    this.pageSource = pageSource;
  }

  getPageSource() {
    return this.pageSource;
  }

  public getTypeTraitement(typeTraitement) {
    switch (typeTraitement.toUpperCase()) {
      case 'D':
        return 'Aligneurs sup/inf';
      case 'I':
        return 'Aligneurs inférieurs';
      case 'S':
        return 'Aligneurs supérieurs';
    }
  }

  public getStatus(status) {
    switch (status.toUpperCase()) {
      case 'O':
        return 'Oui';
      case 'N':
        return 'Non';
    }
  }

  stepColor(idStep) {
    switch (idStep) {
      case 1:
        return '#0079a4';
      case 2:
        return '#03aec8';
      case 3:
        return '#ffee58';
      case 4:
        return '#fdd835';
      case 5:
        return '#ffca28';
      case 6:
        return '#ffb300';
      case 7:
        return '#66bb6a';
      case 8:
        return '#388e3c';
    }
  }

  refactorImg(data: string) {
    return data.replace('data:null', 'data:image/JPEG');
  }

  refactorVideo(data: string) {
    return data.replace('data:null', 'data:video/mp4');
  }

  getLibelPhoto(idPhoto: string) {
    for (let pic of this.picRadio) {
      if (pic.idDocument.toLowerCase() === idPhoto.toLowerCase())
        return pic.libelle;
    }
    return '';
  }

  getLibelleDocument(idDocument: string) {
    for (let pic of this.documents) {
      if (pic.idDocument.toLowerCase() === idDocument.toLowerCase())
        return pic.libelle;
    }
    return '';
  }


}
