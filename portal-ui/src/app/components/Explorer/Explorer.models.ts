export enum ExplorerItemType {
  EMPTY = 'empty',

  DATA_SET = 'dataSet',
  TABLE = 'table',
  PROJECT = 'project',

  LIBRARY = 'library',
  FOLDER = 'folder',
  DOCUMENT = 'document',

  DATA_SET_ROOT = 'dataSetRoot',
  LIBRARY_ROOT = 'libraryRoot',
  PROJECTS_ROOT = 'projectsRoot',
  ROOT = 'root'
}

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
