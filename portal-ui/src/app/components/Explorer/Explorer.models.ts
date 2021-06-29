import { ReactNode } from 'react';

import { PageOptions, SortDir } from '../../services/models';
import { Emitter } from '../../services/util/Emitter';

import { ExplorerStore } from './Explorer.store';

export enum ExplorerItemType {
  EMPTY = 'empty',

  DATASET = 'dataset',
  TABLE = 'table',
  PROJECT = 'project',

  LIBRARY = 'library',
  FOLDER = 'folder',
  DOCUMENT = 'document',

  BASEMAP = 'basemap',

  DATASET_ROOT = 'datasetRoot',
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

export interface Adapter {
  getId: (item: ExplorerItemData) => string;
  getTitle: (item: ExplorerItemData) => ReactNode;
  getMeta: (item: ExplorerItemData) => string;
  getDescription?: (item: ExplorerItemData) => ReactNode;
  getIcon?: (item: ExplorerItemData) => ReactNode;
  isFolder: (item: ExplorerItemData) => boolean;
  getChildren?: (item: ExplorerItemData, options: PageOptions) => Promise<[ExplorerItemData[], number]>;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildrenSortDefaultValue?: (item: ExplorerItemData) => string;
  getChildrenSortDefaultDirection?: (item: ExplorerItemData) => SortDir;
  getChildrenFilterField?: (item: ExplorerItemData) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData) => string;
  getToolbarActions?: (item: ExplorerItemData, store: ExplorerStore) => ReactNode;
  getEmptyListView?: (item: ExplorerItemData) => ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData) => Emitter[];
  getAllowedActions?: (item: ExplorerItemData) => Promise<AllowedActions>;
  deleteItem?: (item: ExplorerItemData) => Promise<void>;
}

enum ActionType {
  DELETE = 'delete',
  DOWNLOAD = 'download'
}

export type AllowedActions = { [key in ActionType]?: ActionDetails };

export interface ActionDetails {
  visible?: boolean;
  disabled?: boolean;
  needConfirmation?: boolean;
  confirmationText?: string;
  confirmationMood?: 'normal' | 'warning';
  url?: string;
  fileName?: string;
}
