import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { of, combineLatest } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';


@Injectable()
export class AddTraitementResolver implements Resolve<any> {
    constructor(private api: ApiService) { }

    resolve() {
        var typeDentiste = this.api.getData(Endpoint.TYPE_DENT, AuthorizationType.Token);
        var typeDocument = this.api.getData(Endpoint.TYPE_DOCUMENT, AuthorizationType.Token);
        return combineLatest(typeDentiste, typeDocument).pipe(catchError(error => {
            return of(error);
        }));
    }
}
