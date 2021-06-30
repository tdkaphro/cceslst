import { TraitementStep } from './traitement-step.model';

export class TraitementHistory {
    idTraitementHistorique: number;
    idTraitement: number;
    etape: TraitementStep;
    dateDeb: string;
    dateFin: string;
    encodedFile: any;
    fileNameOrigin: string;
    login: string;
    motif: any;
}
