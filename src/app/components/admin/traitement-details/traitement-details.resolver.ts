import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { of, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class TraitementDetailsAdminResolver implements Resolve<any> {
    constructor(private api: ApiService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const payload = new HttpParams().set('idTraitement', route.paramMap.get('id'));
        var history = this.api.getData(Endpoint.TRAITEMENT_HISTORY + route.paramMap.get('id'), AuthorizationType.Token);
        var traitement = this.api.postData(Endpoint.TRAITEMENT_BY_ID, payload, AuthorizationType.Token);
        return combineLatest(history, traitement).pipe(catchError(error => {
            return of(error);
        }));
    }
}
