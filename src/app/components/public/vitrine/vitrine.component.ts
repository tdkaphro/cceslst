import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterListenerService } from 'src/app/utils/router-listener.service';

@Component({
  selector: 'app-vitrine',
  templateUrl: './vitrine.component.html',
  styleUrls: ['./vitrine.component.css']
})
export class VitrineComponent implements OnInit, AfterViewInit {

  isLoggedIn = false;

  constructor(private routerListenerService: RouterListenerService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }

  navigateToLogin() {
    this.routerListenerService.setTarget('login');
  }

}
