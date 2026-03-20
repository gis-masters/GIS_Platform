import { SortOrder } from '../../../src/app/services/models';

export const sortDirections: Record<string, SortOrder> = {
  'По возрастанию': SortOrder.ASC,
  'По убыванию': SortOrder.DESC
};

export function getSortDirection(directionTitle: string): SortOrder {
  const sortDirection = sortDirections[directionTitle];
  if (sortDirection) {
    return sortDirection;
  }

  throw new Error(`Неверно указано направление сортировки: ${directionTitle}`);
}
