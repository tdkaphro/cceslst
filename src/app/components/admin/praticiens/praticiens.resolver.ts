import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { of, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';


@Injectable()
export class PraticiensResolver implements Resolve<any> {
    constructor(private api: ApiService) { }

    resolve() {
        var activePraticien = this.api.getData(Endpoint.ACTIVE_PRATICIEN, AuthorizationType.Token);
        var inactivePraticien = this.api.getData(Endpoint.INACTIVE_PRATICIEN, AuthorizationType.Token);
        return combineLatest(activePraticien, inactivePraticien).pipe(catchError(error => {
            return of(error);
        }));
    }
}
