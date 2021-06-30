import { EtapeTransition } from './etape-transition.model';

export class PossibleTransition {
    etapeCible: EtapeTransition;
    idEtapeDebut: number;
    idEtapeTransition: number;
    nomTransition: string;
    ordre: number;
}
