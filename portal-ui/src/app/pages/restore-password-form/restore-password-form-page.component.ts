import { Component } from '@angular/core';

import { environment } from '../../services/environment';

@Component({
  selector: 'crg-restore-password-form-page',
  templateUrl: './restore-password-form-page.component.html',
  styleUrls: ['./restore-password-form-page.component.scss']
})
export class RestorePasswordFormPageComponent {
  backgroundImage = environment.background;

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }
}
