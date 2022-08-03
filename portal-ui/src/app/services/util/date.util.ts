import moment from 'moment';

export function formatDate(value: string | number | Date, format = 'DD.MM.YYYY'): string {
  moment.locale('ru');
  const date = moment(value);

  return date.isValid() ? date.format(format) : value && String(value);
}
