export enum ExplorerItemType {
  EMPTY = 'empty',
  DATA_SET = 'dataSet',
  TABLE = 'table',

  DATA_SET_ROOT = 'dataSetRoot'
}

export interface ExplorerItemPayloads {}

export interface ExplorerItemData<T = ExplorerItemPayloads[ExplorerItemType]> {
  type: ExplorerItemType;
  payload?: T;
  children?: ExplorerItemData[];
}

export const emptyItem: ExplorerItemData = { type: ExplorerItemType.EMPTY, payload: { title: '' } };

export interface SortItem {
  label: string;
  value: string;
}
