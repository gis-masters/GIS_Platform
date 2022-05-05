import moment from 'moment';

export function formatDate(value: unknown, format = 'DD.MM.YYYY'): string {
  moment.locale('ru');
  const date = moment(value);

  return date.isValid() ? date.format(format) : String(value);
}
