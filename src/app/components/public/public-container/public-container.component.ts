import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Role } from 'src/app/models/enum/role.enum';
import { RouterListenerService } from 'src/app/utils/router-listener.service';

@Component({
  selector: 'app-public-container',
  templateUrl: './public-container.component.html',
  styleUrls: ['./public-container.component.css']
})
export class PublicContainerComponent {

  isLoggedIn = false;
  loginLabel = '';
  subscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  public navIsTransparent: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private auth: AuthService,
    private routerListenerService: RouterListenerService
  ) {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.isLoggedIn ? this.loginLabel = 'Mon compte' : this.loginLabel = 'Se connecter';
    this.subscription = this.routerListenerService.getTarget().subscribe(res => {
      this.navigateToLogin();
    });
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
    this.subscription.unsubscribe();
  }

  scroll = (event): void => {
    let number = event.srcElement.scrollTop;
    if (number > 400) {
      if (this.navIsTransparent)
        this.navIsTransparent = false;
    } else {
      if (!this.navIsTransparent)
        this.navIsTransparent = true;
    }
  };

  navigateToClientAccess() { }

  navigateToLogin() {
    if (!this.isLoggedIn) {
      this.routerOutlet.deactivate();
      this.router.navigate(['/auth']);
    } else if (this.auth.getCurrentUser().profil.role === Role.Admin) {
      this.routerOutlet.deactivate();
      this.router.navigate(['/admin']);
    } else {
      this.routerOutlet.deactivate();
      this.router.navigate(['/praticien']);
    }
  }

}
