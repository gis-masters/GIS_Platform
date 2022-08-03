import { Component, OnInit } from '@angular/core';

import { getEnvironment, Platform } from '../../services/environment';

@Component({
  selector: 'crg-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  envPlatform: Platform = 'simf';

  async ngOnInit() {
    const env = await getEnvironment();
    this.envPlatform = env.platform;
  }
}
