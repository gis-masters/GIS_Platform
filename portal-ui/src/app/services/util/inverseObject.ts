import { ValueOf } from '../models';

/**
 * Инвертирует объект так, что ключи становятся значениями, а значения ключами
 */
export function inverseObject<T extends Record<string | number | symbol, string | number | symbol>>(
  o: T
): Record<ValueOf<T>, keyof T> {
  return Object.fromEntries(Object.entries(o).map(([key, value]) => [value, key])) as Record<ValueOf<T>, keyof T>;
}
