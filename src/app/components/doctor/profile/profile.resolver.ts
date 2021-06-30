import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve, Router, RouterOutlet } from '@angular/router';

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';


@Injectable()
export class ProfileResolver implements Resolve<any> {
    constructor(private api: ApiService,
        private auth: AuthService
    ) { }

    resolve() {
        return this.api.getData(Endpoint.INFO_USER + this.auth.getCurrentUser().login, AuthorizationType.Token).pipe(catchError(error => {
            return of(error);
        }));
    }
}
