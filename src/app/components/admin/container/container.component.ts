import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { UserInfo } from 'src/app/models/user-info.model';
import { AuthService } from 'src/app/auth/auth.service';
import { TraitementMessage } from 'src/app/models/traitement-message.model';
import { HelperService } from 'src/app/utils/helper.service';
import { NotificationModel } from 'src/app/models/notification.model';
import { ApiService } from 'src/app/api/api.service';
import * as Endpoint from '../../../utils/endpoints';
import { AuthorizationType } from 'src/app/models/enum/authorization-type.enum';
import { HttpParams } from '@angular/common/http';
import { ToastService } from 'src/app/utils/toast.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent {

  selectedMenuItem = -1;

  @ViewChild('drawer', { static: false }) drawer;
  isHandset;

  messagesResult: any;
  messages: TraitementMessage[] = [];
  notifsResult: any;
  notifications: NotificationModel[] = [];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay(),
      tap(result => this.isHandset = result)
    );

  displayName = '';
  currentUser = new UserInfo();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private api: ApiService,
    private toast: ToastService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.displayName = this.currentUser.prenom + ' ' + this.currentUser.nom;
    this.notifsResult = this.activatedRoute.snapshot.data.value[0];
    this.messagesResult = this.activatedRoute.snapshot.data.value[1];
    if (!this.notifsResult || !this.messagesResult) {
      this.logout();
    }
    if (this.notifsResult.header && this.messagesResult.header) {
      if (this.notifsResult.header.resultCode === '0000') {
        this.notifications = this.notifsResult.content;
      }
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
    this.router.navigate(['/admin/main/update-password']);
  }

  navigateToTraitements(item: TraitementMessage) {

  }

  goHome() {
    this.router.navigate(['/admin']);
  }

  closeDrawer() {
    if (this.isHandset)
      this.drawer.toggle();
  }

  navigateToTraitementDetails(item, sourcePage: string) {
    this.helperService.setPageSource(sourcePage);
    this.router.navigate(['/admin/main/traitement/' + item.idTraitement]);
  }

  ignoreNotif(item) {
    const payload = new HttpParams()
      .set('login', this.authService.getCurrentUser().login)
      .set('idTraitementNotification', item.idTraitementNotification)
      .set('statut', 'L');
    this.api.postData(Endpoint.CHANGE_NOTIF_STATUS, payload, AuthorizationType.Token).subscribe(res => {
      if (res.resultCode === '0000') {
        this.notifications = this.notifications.filter(notif => notif.idTraitementNotification !== item.idTraitementNotification);
        this.toast.success('Notification supprimé!', { closeButton: true, progressBar: true });
      }
    }, err => {
      if (err.status === 401) {
        this.toast.error('Session expirée, veuillez vous reconnecter!', { closeButton: true, progressBar: true });
        this.logout();
      }
    });
  }

  handleMenuItem(itemIndex) {
    this.selectedMenuItem = this.selectedMenuItem === itemIndex ? -1 : itemIndex;
  }

}
