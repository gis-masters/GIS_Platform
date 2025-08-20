import { VectorTable } from './vectorData.models';

export function tablesEqual(firstTable: VectorTable, ...otherTables: VectorTable[]): boolean {
  const { identifier, dataset } = firstTable;

  return otherTables.every(table => table.identifier === identifier && table.dataset === dataset);
}
