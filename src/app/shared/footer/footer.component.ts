import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  currentYear = (new Date()).getFullYear();

  constructor() {
    
  }

  ngOnInit() {
  }

  navigateToFacebook() {
    window.open("https://www.facebook.com/accessaligner/", '_blank');
  }

  navigateToYoutube() {
    window.open("https://www.youtube.com/channel/UCeW1AoQNezHb1TWslcWjS-A", '_blank');
  }
  navigateToTwitter() {}
  navigateToLinkedin() {}

  navigateToDeveloper () {
    window.open("https://www.linkedin.com/company/idaq-solutions/", '_blank');
  }

}
