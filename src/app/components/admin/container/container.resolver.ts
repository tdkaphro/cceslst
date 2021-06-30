import { AuthorizationType } from './../../../models/enum/authorization-type.enum';
import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';

import { combineLatest, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpParams } from '@angular/common/http';


@Injectable()
export class AdminContainerResolver implements Resolve<any> {
    constructor(private api: ApiService,
        private auth: AuthService
    ) { }

    resolve() {
        const data = new HttpParams().set('login', this.auth.getCurrentUser().login);
        const payload = new HttpParams().set('login', this.auth.getCurrentUser().login).set('statut', 'N');
        var notifications = this.api.postData(Endpoint.NOTIFICATIONS, payload, AuthorizationType.Token);
        var messages = this.api.postData(Endpoint.NOTIFICATION_COMMENTS, data, AuthorizationType.Token);
        return combineLatest(notifications, messages).pipe(catchError(error => {
            return of(error);
        }));
    }
}
