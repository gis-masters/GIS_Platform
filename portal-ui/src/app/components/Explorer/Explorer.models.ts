import { ReactNode } from 'react';

import { DataChangeEventDetail } from '../../services/communication.service';
import { FilterQuery } from '../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { Emitter } from '../../services/common/Emitter';

import { ExplorerStore } from './Explorer.store';
import { ExplorerService } from './Explorer.service';

export type ExplorerRole =
  | 'SelectVectorTable'
  | 'SelectLibraryRecord'
  | 'DocumentMove'
  | 'DocumentsSelectDialog'
  | 'dm'
  | 'ConnectionsToProjectsWidget'
  | 'DocumentVersions'
  | 'SelectFolder'
  | 'taskJournalHistory'
  | '';

export enum ExplorerItemType {
  NONE = 'none',

  DATASET = 'dataset',
  TABLE = 'table',
  PROJECT = 'project',

  MESSAGES_REGISTRY = 'msg',
  LIBRARY = 'lib',
  FOLDER = 'folder',
  DOCUMENT = 'doc',
  FILE = 'file',

  BASEMAP = 'basemap',

  SCHEMA = 'schema',

  DATASET_ROOT = 'dr',
  LIBRARY_ROOT = 'lr',
  PROJECTS_ROOT = 'pr',
  BASEMAPS_ROOT = 'br',
  SCHEMAS_ROOT = 'sr',
  TASKS_ROOT = 'tr',
  DOCUMENT_VERSIONS_ROOT = 'dvr',
  DOCUMENT_VERSION = 'dv',
  TASK_HISTORY_ROOT = 'thr',
  TASK_HISTORY = 'th',
  MESSAGES_REGISTRIES_ROOT = 'mrr',
  ROOT = 'r'
}

export enum ExplorerItemEntityTypeTitle {
  DATASET = 'набора данных',
  TABLE = 'таблицы',

  LIBRARY = 'библиотеки',
  FOLDER = 'папки',
  DOCUMENT = 'документа',

  PROJECT = 'проекта'
}

export interface ExplorerItemData<T = ExplorerItemPayloads[ExplorerItemType]> {
  type: ExplorerItemType;
  payload: T;
}

export type CustomFilters = Partial<Record<ExplorerItemType, FilterQuery>>;

export const emptyItem: ExplorerItemData = { type: ExplorerItemType.NONE, payload: {} };
export const loadingItem: ExplorerItemData = { type: ExplorerItemType.NONE, payload: { loading: true } };

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

export interface Adapter<
  T = ExplorerItemPayloads[keyof ExplorerItemPayloads],
  C = ExplorerItemPayloads[keyof ExplorerItemPayloads]
> {
  getId: (item: ExplorerItemData<T>) => string;
  getTitle: (item: ExplorerItemData<T>) => ReactNode;
  getMeta: (item: ExplorerItemData<T>) => string;
  getDescription?: (item: ExplorerItemData<T>) => ReactNode;
  getIcon?: (item: ExplorerItemData<T>) => ReactNode;
  isFolder: (item: ExplorerItemData<T>, store: ExplorerStore) => boolean;
  customOpenActionIcon?: (item: ExplorerItemData<T>) => ReactNode;
  customOpenAction?: (item: ExplorerItemData<T>) => void;
  getChildren?: (
    item: ExplorerItemData<T>,
    pageOptions: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ) => [ExplorerItemData<C>[], number] | Promise<[ExplorerItemData<C>[], number]>;
  getChildrenWithParticularOne?: (
    item: ExplorerItemData<T>,
    pageOptions: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ) =>
    | [ExplorerItemData<C>[], number, number]
    | Promise<[ExplorerItemData<C>[], number, number] | undefined>
    | undefined;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildById?: (
    item: ExplorerItemData<T>,
    id: string,
    type: ExplorerItemType
  ) => ExplorerItemData<C> | Promise<ExplorerItemData<C>> | undefined;
  getChildrenSortDefaultValue?: (item: ExplorerItemData<T>) => string;
  getChildrenSortDefaultOrder?: (item: ExplorerItemData<T>) => SortOrder;
  getChildrenFilterField?: (item: ExplorerItemData<T>) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData<T>) => string;
  getToolbarActions?: (
    item: ExplorerItemData<T>,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ) => Promise<ReactNode> | ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData<T>) => Emitter<DataChangeEventDetail<unknown>>[];
  getActions?: (item: ExplorerItemData<T>) => ReactNode;
}
