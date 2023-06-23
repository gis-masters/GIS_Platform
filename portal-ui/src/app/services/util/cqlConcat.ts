export function cqlConcat(...queries: (string | undefined | null)[]): string {
  return queries.filter(Boolean).join(' AND ');
}
