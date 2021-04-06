export enum ExplorerItemType {
  EMPTY = 'empty',

  DATA_SET = 'dataSet',
  TABLE = 'table',
  PROJECT = 'project',

  LIBRARY = 'library',
  FOLDER = 'folder',
  DOCUMENT = 'document',

  BASEMAP = 'basemap',

  DATA_SET_ROOT = 'dataSetRoot',
  LIBRARY_ROOT = 'libraryRoot',
  PROJECTS_ROOT = 'projectsRoot',
  BASEMAPS_ROOT = 'basemapsRoot',
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

export enum KeyAction {
  NEXT = 'next',
  PREV = 'prev',
  OPEN = 'open',
  BACK = 'back',
  PAGE_PREV = 'pagePrev',
  PAGE_NEXT = 'pageNext'
}

export const keyActions: { [key in KeyAction]: string[] } = {
  [KeyAction.PREV]: ['ArrowUp'],
  [KeyAction.NEXT]: ['ArrowDown'],
  [KeyAction.OPEN]: ['Enter'],
  [KeyAction.BACK]: ['Backspace'],
  [KeyAction.PAGE_PREV]: ['ArrowLeft'],
  [KeyAction.PAGE_NEXT]: ['ArrowRight']
};

export const pageSizeVariants = [5, 10, 20, 50, 100];
