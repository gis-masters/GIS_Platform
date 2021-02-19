import { ErrorHandler, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

import { Toast } from '../components/Toast/Toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: NGXLogger) {}

  handleError(error: Error) {
    Toast.error({ error }, null, true);
    this.logger.error(error);
  }
}
