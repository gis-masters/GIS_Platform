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

  constructor(private router: Router) {}

  async ngOnInit() {
    this.envPlatform = (await getEnvironment()).platform;
  }

  how(): void {
    void this.router.navigate(['/about']);
  }

  login(): void {
    void this.router.navigate(['/login']);
  }

  register(): void {
    void this.router.navigate(['/register']);
  }
}
