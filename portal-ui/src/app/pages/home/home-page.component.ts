import { Component } from '@angular/core';

import { environment } from '../../services/environment';

@Component({
  selector: 'crg-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  backgroundImage = environment.background;

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }
}
