import {Router} from '@angular/router';
import {Component} from '@angular/core';

@Component({
  selector: 'crg-header',
  templateUrl: './header@conv.component.html',
  styleUrls: ['./header@conv.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) { }

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
