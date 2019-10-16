import { Component } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { getEnvironment } from '../../services/environment';

@Component({
  selector: 'crg-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private logger: NGXLogger) {
    this.getEnv();
  }

  private async getEnv () {
    const environment = await getEnvironment();
    this.logger.debug('Version: ', environment);
  }
}
