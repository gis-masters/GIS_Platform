import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { getEnvironment, Platform } from '../../services/environment';

@Component({
  selector: 'crg-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  envPlatform: Platform = 'simf';
  envRegistration: boolean;

  constructor(private router: Router) {}

  async ngOnInit() {
    const env = await getEnvironment();
    this.envPlatform = env.platform;
    this.envRegistration = !!env.registration?.length;
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
