import type { FieldErrors } from './formValidation.utils';

/** Выбрасывается из actionFunction, чтобы Form применил ошибки полей и соблюдался only-throw-error. */
export class FormFieldErrorsError extends Error {
  constructor(public readonly fieldErrors: FieldErrors[]) {
    super('FormFieldErrorsError');
    this.name = 'FormFieldErrorsError';
  }
}
