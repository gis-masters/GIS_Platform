import { ErrorHandler, Injectable } from '@angular/core';
import { ToastError } from '../components/ToastError/ToastError';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error) {
    ToastError.show({error});
    console.error(error);
  }
}
