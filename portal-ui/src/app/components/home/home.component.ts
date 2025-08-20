import { Component, OnInit } from '@angular/core';

import { environment, Platform } from '../../services/environment';

@Component({
  selector: 'crg-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  envPlatform: Platform = 'simf';

  ngOnInit() {
    this.envPlatform = environment.platform;
  }
}
