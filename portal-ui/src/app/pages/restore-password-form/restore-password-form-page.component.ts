import { Component } from '@angular/core';

import { getEnvironment } from '../../services/environment';

@Component({
  selector: 'crg-restore-password-form-page',
  templateUrl: './restore-password-form-page.component.html',
  styleUrls: ['./restore-password-form-page.component.scss']
})
export class RestorePasswordFormPageComponent {
  backgroundImage: string;

  async ngOnInit() {
    const env = await getEnvironment();
    this.backgroundImage = env.background;
  }

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }
}
