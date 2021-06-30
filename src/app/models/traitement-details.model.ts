import { UserInfo } from './user-info.model';
import { TraitementStep } from './traitement-step.model';
import { TraitementDocument } from './traitement-document.model';
import { TraitementTypeDent } from './traitement-type-dent.model';

export class TraitementDetails {
    commentaires: string;
    dateCreation: string;
    dateNaissancePatient: string;
    etape: TraitementStep;
    flgBeance: string;
    flgClasse: string;
    flgEspace: string;
    flgExtraction: string;
    flgOccIa: string;
    flgOccIp: string;
    flgSupracc: string;
    flgSurplomb: string;
    idTraitement: number;
    listTraitementDocument: TraitementDocument[];
    listTraitementTypeDent: TraitementTypeDent[];
    login: string;
    nomPatient: string;
    prenomPatient: string;
    sexePatient: string;
    typeTraitement: string;
    userCre?: UserInfo;
    patientAge?: any;
}
