import { AuthService } from 'src/app/auth/auth.service';
import { UserInfo } from './../../models/user-info.model';
import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { TraitementMessage } from 'src/app/models/traitement-message.model';
import { HelperService } from 'src/app/utils/helper.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayName = '';
  currentUser = new UserInfo();
  messagesResult: any;
  messages: TraitementMessage[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.displayName = this.currentUser.prenom + ' ' + this.currentUser.nom;
    this.messagesResult = this.activatedRoute.snapshot.data.value;
    if (this.messagesResult.header) {
      if (this.messagesResult.header.resultCode === '0000') {
        this.messages = this.messagesResult.content;
      }
    } else {
      this.logout();
    }
  }

  navigateToClientAccess() { }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  navigateToProfile() {
    this.router.navigate(['/praticien/main/profile']);
  }

  navigateToPassword() {
    this.router.navigate(['/praticien/main/edit-password']);
  }

  goHome() {
    this.router.navigate(['/praticien/main']);
  }

  navigateToTraitementDetails(idTraitement) {
    this.helperService.setPageSource('message');
    this.router.navigate(['/praticien/main/traitement/' + idTraitement]);
  }

}
