import { Component, Input } from '@angular/core';

import { getEnvironment } from '../../services/environment';

@Component({
  selector: 'crg-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  @Input('background-image')
  backgroundImage: string;

  async ngOnInit() {
    this.backgroundImage = (await getEnvironment()).background;
  }

  setStyle(): Record<string, string> {
    return {
      backgroundImage: `url("${this.backgroundImage}")`
    };
  }
}
