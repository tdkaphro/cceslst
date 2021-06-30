import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, ActivationStart } from '@angular/router';
import { AuthService } from './auth.service';
import { UserInfo } from '../models/user-info.model';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, public activatedRoute: ActivatedRoute) {
  }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      //can not activate
      this.router.navigate(['/auth']);
      return false;
    }
    let userInfo: UserInfo = JSON.parse(localStorage.getItem('user_data'));
    this.router.events.pipe(
      filter(event => event instanceof ActivationStart),
      take(1)
    ).subscribe(event => {
      if (event['snapshot'].data.roles && event['snapshot'].data.roles.indexOf(userInfo.profil.role) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }
      return true;
    });
    // can activate
    return true;
  }
}
