import { AuthorizationType } from '../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { of, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class PraticienAdminResolver implements Resolve<any> {
    constructor(private api: ApiService,
        private auth: AuthService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const payLoad = new HttpParams()
            .set('login', route.paramMap.get('login'));
        var userInfo = this.api.getData(Endpoint.INFO_USER + route.paramMap.get('login'), AuthorizationType.Token);
        var traitementByUser = this.api.postData(Endpoint.TRAITEMENT_BY_PRATICIEN, payLoad, AuthorizationType.Token)
        return combineLatest(userInfo, traitementByUser).pipe(catchError(error => {
            return of(error);
        }));
    }
}
