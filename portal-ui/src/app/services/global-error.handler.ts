import { ErrorHandler, Injectable } from '@angular/core';
import { Toast } from '../components/Toast/Toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    Toast.error({error});
    console.error(error);
  }
}
