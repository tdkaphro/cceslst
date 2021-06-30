import { Injectable } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserInfo } from '../models/user-info.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticated(): boolean {
    return localStorage.getItem('token_auth') !== null && localStorage.getItem('user_data') !== null;
    // Check whether the token is expired and return
    // true or false

    //const helper = new JwtHelperService();

    // const decodedToken = helper.decodeToken(token);
    // const expirationDate = helper.getTokenExpirationDate(token);
    // return !helper.isTokenExpired(token);
    // return true;
  }

  getCurrentUser() {
    const userInfo: UserInfo = JSON.parse(localStorage.getItem('user_data'));
    userInfo.login = userInfo.login.toLowerCase();
    return userInfo;
  }
}
