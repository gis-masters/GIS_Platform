import {Router} from '@angular/router';
import {Component} from '@angular/core';

@Component({
  selector: 'crg-header',
  templateUrl: './header@simf.component.html',
  styleUrls: ['./header@simf.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router) { }

  login() {
    this.router.navigate(['/login']);
  }
}
