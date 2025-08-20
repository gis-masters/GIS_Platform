import { Component } from '@angular/core';

import { environment } from '../../services/environment';

@Component({
  selector: 'crg-change-password-form-page',
  templateUrl: './change-password-form-page.component.html',
  styleUrls: ['./change-password-form-page.component.scss']
})
export class ChangePasswordFormPageComponent {
  backgroundImage = environment.background;

  setStyle(): Record<string, string> {
    return this.backgroundImage
      ? {
          backgroundImage: `url("${this.backgroundImage}")`
        }
      : {};
  }
}
