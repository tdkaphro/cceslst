import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RoutesRecognized, Event } from '@angular/router';
import { HelperService } from './utils/helper.service';
import { LoaderService, LoaderState } from './utils/loader/loader.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  loading = false;

  constructor (private metaService: Meta, private router: Router, private helper: HelperService, private loaderService: LoaderService) {
    
    router.events.subscribe((routerEvent: Event) => {
      this.helper.setRouterEvent(routerEvent);
      this.checkRouterEvent(routerEvent);
    });
    this.loaderService.loaderState.subscribe((state: LoaderState) => {
      this.loading = state.show;
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      //this.loading = true;
      //alert('start')
    }

    if (routerEvent instanceof NavigationEnd ||
      routerEvent instanceof NavigationCancel ||
      routerEvent instanceof NavigationError) {
      //this.loading = false;
    }

    if (routerEvent instanceof RoutesRecognized) {
      // console.log('navigated to:', event.url);
      // console.log('route state', event.state);
      // console.log('');
      // alert(routerEvent.url);
      /*if (routerEvent.url === '/') {
        if (!this.isLoggedIn) {
          this.router.navigate(['/login'], { replaceUrl: true });
        } else {
          this.router.navigate(['/main']);
        }
      }*/
    }
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    AOS.init({
      duration: 1200,
    });
    //window.addEventListener('scroll', this.scrollEvent, true);
    
  }

  ngOnDestroy() {
    //window.removeEventListener('scroll', this.scrollEvent, true);
  }

  /*scrollEvent = (event: any): void => {
    const number = event.srcElement.scrollTop;
    console.log(number)
  }*/
}
