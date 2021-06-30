import { AuthorizationType } from '../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { of, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';


@Injectable()
export class FilteredTraitementsResolver implements Resolve<any> {
    constructor(private api: ApiService,
        private auth: AuthService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        let ids = route.paramMap.get('filter').split('&');
        let parameters = [];
        for (let id of ids) {
            parameters.push(this.api.getData(Endpoint.FILTERED_TRAITEMENTS_BY_ADMIN + id, AuthorizationType.Token));
        }
        return this.loadData(parameters);
    }

    loadData(parameters) {
        switch (parameters.length) {
            case 1:
                return combineLatest(parameters[0]).pipe(catchError(error => {
                    return of(error);
                }));
            case 2:
                return combineLatest(parameters[0], parameters[1]).pipe(catchError(error => {
                    return of(error);
                }));
            case 3:
                return combineLatest(parameters[0], parameters[1], parameters[2]).pipe(catchError(error => {
                    return of(error);
                }));
        }
    }
}
