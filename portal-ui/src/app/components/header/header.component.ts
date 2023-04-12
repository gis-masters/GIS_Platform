import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Platform, environment } from '../../services/environment';

@Component({
  selector: 'crg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  envPlatform: Platform = 'simf';
  envRegistration: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.envPlatform = environment.platform;
    this.envRegistration = !!environment.registration;
  }

  how(): void {
    void this.router.navigate(['/about']);
  }

  login(): void {
    void this.router.navigate(['/']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }
}
