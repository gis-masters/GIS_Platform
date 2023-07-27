import { notFalsyFilter } from './NotFalsyFilter';

export function cqlConcat(...queries: (string | undefined | null)[]): string {
  return queries.filter(notFalsyFilter).join(' AND ');
}
