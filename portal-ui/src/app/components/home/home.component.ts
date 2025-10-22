import { Component, type OnInit } from '@angular/core';

import { environment, type Platform } from '../../services/environment';

@Component({
  selector: 'crg-home',
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent implements OnInit {
  envPlatform: Platform = 'simf';

  ngOnInit() {
    this.envPlatform = environment.platform;
  }
}
