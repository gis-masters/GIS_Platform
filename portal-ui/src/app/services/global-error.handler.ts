import { ErrorHandler, Injectable } from '@angular/core';
import { AxiosResponse } from 'axios';
import { NGXLogger } from 'ngx-logger';

import { Toast } from '../components/Toast/Toast';

interface Rejection {
  message: string;
  response: AxiosResponse;
}

interface ServerError {
  rejection?: Rejection;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private logger: NGXLogger) {}

  handleError(error: Error): void {
    if ((error as ServerError).rejection?.response?.status) {
      const serverError = error as ServerError;
      const res = serverError.rejection?.response;

      if ((res?.status || 0) >= 400 && res?.status !== 401) {
        Toast.error({
          message: serverError.rejection?.message,
          canBeSuppressed: true,
          details: `\n Status: ${res?.status}
            \n URL: ${res?.config.url}
            \n Method: ${res?.config.method}`
        });
      } else if (res?.status !== 401) {
        Toast.error({ error, canBeSuppressed: true });
      }
    } else {
      // #NoRedToast :)
      // Toast.error({ error, canBeSuppressed: true });
    }

    this.logger.error(error);
  }
}
