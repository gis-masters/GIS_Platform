import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';
import {Component} from '@angular/core';

@Component({
  selector: 'crg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router,
              private logger: NGXLogger) {
  }

  how() {
    this.router.navigate(['/about']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

}
