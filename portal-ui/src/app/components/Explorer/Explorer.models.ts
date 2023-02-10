import { ReactNode } from 'react';

import { DataChangeEvent } from '../../services/communication.service';
import { FilterQuery } from '../../services/util/filterObjects';
import { PageOptions, SortOrder } from '../../services/models';
import { Emitter } from '../../services/common/Emitter';

import { ExplorerStore } from './Explorer.store';
import { ExplorerService } from './Explorer.service';

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

export interface Adapter {
  getId: (item: ExplorerItemData) => string;
  getTitle: (item: ExplorerItemData) => ReactNode;
  getMeta: (item: ExplorerItemData) => string;
  getDescription?: (item: ExplorerItemData) => ReactNode;
  getIcon?: (item: ExplorerItemData) => ReactNode;
  isFolder: (item: ExplorerItemData) => boolean;
  customOpenActionIcon?: (item: ExplorerItemData) => ReactNode;
  customOpenAction?: (item: ExplorerItemData) => void;
  getChildren?: (
    item: ExplorerItemData,
    pageOptions: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ) => [ExplorerItemData[], number] | Promise<[ExplorerItemData[], number]>;
  getChildrenWithParticularOne?: (
    item: ExplorerItemData,
    pageOptions: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ) => [ExplorerItemData[], number, number] | Promise<[ExplorerItemData[], number, number]> | undefined;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildById?: (
    item: ExplorerItemData,
    id: string,
    type: ExplorerItemType
  ) => ExplorerItemData | Promise<ExplorerItemData>;
  getChildrenSortDefaultValue?: (item: ExplorerItemData) => string;
  getChildrenSortDefaultOrder?: (item: ExplorerItemData) => SortOrder;
  getChildrenFilterField?: (item: ExplorerItemData) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData) => string;
  getToolbarActions?: (
    item: ExplorerItemData,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ) => Promise<ReactNode> | ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData) => Emitter<DataChangeEvent<unknown>>[];
  getActions?: (item: ExplorerItemData) => ReactNode;
}
