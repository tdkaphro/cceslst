import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private router: Router, private routerOutlet: RouterOutlet) {
  }

  ngOnInit() {

  }

  goHome() {
    this.routerOutlet.deactivate();
    this.router.navigate(['/public']);
  }



}
