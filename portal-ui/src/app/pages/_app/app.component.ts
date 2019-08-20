import {NGXLogger} from 'ngx-logger';
import {Component} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'crg-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private logger: NGXLogger) {
    logger.debug('Version: ', environment);
  }

}
