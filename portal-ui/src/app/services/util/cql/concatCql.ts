import { notFalsyFilter } from '../NotFalsyFilter';

/**
 * Объединяет несколько CQL-фильтров оператором AND.
 *
 * @param queries CQL-фильтры для объединения
 * @returns Объединённый CQL-фильтр.
 */
export function concatCql(...queries: (string | undefined | null)[]): string {
  return queries.filter(notFalsyFilter).join(' AND ');
}
