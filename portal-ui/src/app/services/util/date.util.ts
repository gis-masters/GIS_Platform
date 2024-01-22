import moment from 'moment';

export function formatDate(value: string | number | Date, format = 'DD.MM.YYYY'): string {
  if (!value) {
    return '';
  }

  const date = moment(value);

  return date.isValid() ? date.format(format) : String(value);
}
