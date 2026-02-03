/**
 * Проверяет, является ли переданный аргумент массивом через Array.isArray.
 * Предпочтительно использовать эту функцию вместо нативной.
 * @description У Array.isArray неправильная защита типов: `value is any[]`,
 * которая ошибочно утверждает, что массив может содержать элементы любого типа.
 * @param value Значение, тип которого проверяется.
 * @returns Значение является массивом.
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
