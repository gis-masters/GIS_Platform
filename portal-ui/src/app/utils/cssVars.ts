import { type CSSProperties } from 'react';

/**
 * Хелпер для создания style объекта с CSS custom properties
 * Обходит ограничение TypeScript на добавление index signature в csstype.Properties
 */
export function cssVars<T extends Record<`--${string}`, string | number | undefined>>(vars: T): CSSProperties {
  return vars as CSSProperties;
}
