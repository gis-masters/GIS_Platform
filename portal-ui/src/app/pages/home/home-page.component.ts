import { Component } from '@angular/core';

import { getEnvironment } from '../../services/environment';

@Component({
  selector: 'crg-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  backgroundImage: string;

  async ngOnInit() {
    this.backgroundImage = (await getEnvironment()).background;
  }

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }
}
