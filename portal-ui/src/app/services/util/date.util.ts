import moment from 'moment';

export const systemFormat = 'YYYY-MM-DD';

export function formatDate(value: string | number | Date | undefined | null, format = 'DD.MM.YYYY'): string {
  if (!value) {
    return '';
  }

  const date = moment(value);

  return date.isValid() ? date.format(format) : String(value);
}
