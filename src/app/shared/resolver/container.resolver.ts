import { AuthorizationType } from './../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class ContainerResolver implements Resolve<any> {
    constructor(private api: ApiService,
        private auth: AuthService
    ) { }

    resolve() {
        const login = this.auth.getCurrentUser().login;
        const data = new HttpParams().set('login', login);
        return this.api.postData(Endpoint.NOTIFICATION_COMMENTS, data, AuthorizationType.Token).pipe(catchError(error => {
            return of(error);
        }));
    }
}
