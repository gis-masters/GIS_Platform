/**
 * Извлекает кадастровый квартал из кадастрового номера.
 * Кадастровый квартал — это первые три группы цифр, разделённых двоеточием.
 * Формат номера: AA:BB:CCCCCC[:DD...]
 *
 * @param cadastralNumber - строка кадастрового номера (например, "71:30:010101:100")
 * @returns строка с номером квартала (например, "71:30:010101") или null, если номер нельзя разобрать
 */
export function getCadastralQuarter(cadastralNumber: string): string | null {
  const parts = cadastralNumber.trim().split(':');

  if (parts.length < 3) {
    return null;
  }

  const quarterParts = parts.slice(0, 3);

  if (!quarterParts.every(part => /^\d+$/.test(part))) {
    return null;
  }

  return quarterParts.join(':');
}
