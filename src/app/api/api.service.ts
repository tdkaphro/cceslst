import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as Constants from '../utils/constants';
import { AuthorizationType } from '../models/enum/authorization-type.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  header: HttpHeaders;
  token = '';

  constructor(private http: HttpClient) { }

  public getData(url: string, authType: string) {
    this.setupHeader(authType);
    return this.http
      .get(url, { headers: this.header })
      .pipe(map(this.extractData), tap(this.logResponse), catchError(this.catchError));
  }
  public postData(url: string, data: any, authType: string) {
    this.setupHeader(authType);
    return this.http
      .post(url, data, { headers: this.header })
      .pipe(map(this.extractData), tap(this.logResponse), catchError(this.catchError));
  }
  public putData(url: string, data: any, authType: string) {
    this.setupHeader(authType);
    return this.http
      .put(url, data, { headers: this.header })
      .pipe(map(this.extractData), tap(this.logResponse), catchError(this.catchError));
  }
  private catchError(error: any) {
    //console.log(error)
    return throwError(error || 'server error.');
  }
  private logResponse(res: any) {
    //console.log(res);
  }
  private extractData(res: any) {
    //console.log(res)
    return JSON.parse(JSON.stringify(res));
  }

  private setupHeader(authType: string) {
    switch (authType) {
      case AuthorizationType.Basic:
        this.header = new HttpHeaders({ 'Authorization': Constants.BASIC_TOKEN, 'Content-Type': 'application/x-www-form-urlencoded' });
        break;
      case AuthorizationType.Token:
        this.token = localStorage.getItem('token_auth');
        this.header = new HttpHeaders({ 'Authorization': this.token});
        break;
      case AuthorizationType.Empty:
        this.header = new HttpHeaders({ 'Authorization': this.token, 'Content-Type': 'application/x-www-form-urlencoded' });
        break;
    }
  }
}
