import { ReactNode } from 'react';

import { DocumentVersionExtended, Library, LibraryRecord } from '../../services/data/library/library.models';
import { MessagesRegistry } from '../../services/data/messagesRegistries/messagesRegistries.models';
import { SearchItemData, SearchItemDataSource } from '../../services/data/search/search.model';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { DataChangeEventDetail } from '../../services/communication.service';
import { Task, TaskHistory } from '../../services/data/task/task.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { PageOptions, SortOrder, ValueOf } from '../../services/models';
import { Basemap } from '../../services/data/basemaps/basemaps.models';
import { FileInfo } from '../../services/data/files/files.models';
import { Schema } from '../../services/data/schema/schema.models';
import { FtsType } from '../../../server-types/common-contracts';
import { FilterQuery } from '../../services/util/filterObjects';
import { Emitter } from '../../services/common/Emitter';

import { ExplorerService } from './Explorer.service';
import { ExplorerStore } from './Explorer.store';

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
  | 'SearchResultDialog'
  | '';

export enum ExplorerItemType {
  NONE = 'none',
  ROOT = 'r',

  DATASET_ROOT = 'dr',
  DATASET = 'dataset',
  TABLE = 'table',

  PROJECTS_ROOT = 'pr',
  PROJECT = 'project',

  LIBRARY_ROOT = 'lr',
  LIBRARY = 'lib',
  FOLDER = 'folder',
  DOCUMENT = 'doc',
  FILE = 'file',

  DOCUMENT_VERSIONS_ROOT = 'dvr',
  DOCUMENT_VERSION = 'dv',

  BASEMAPS_ROOT = 'br',
  BASEMAP = 'basemap',

  TASKS_ROOT = 'tr',
  TASK_HISTORY_ROOT = 'thr',
  TASK_HISTORY = 'th',

  SEARCH_RESULT_ROOT = 'srr',
  SEARCH_ITEM = 'si',

  MESSAGES_REGISTRIES_ROOT = 'mrr',
  MESSAGES_REGISTRY = 'msg',

  SCHEMAS_ROOT = 'sr',
  SCHEMA = 'schema'
}

export interface ExplorerItemPayloads {
  [ExplorerItemType.NONE]: { loading?: boolean };
  [ExplorerItemType.ROOT]: null;

  [ExplorerItemType.DATASET_ROOT]: null;
  [ExplorerItemType.DATASET]: Dataset;
  [ExplorerItemType.TABLE]: VectorTable;

  [ExplorerItemType.PROJECTS_ROOT]: null;
  [ExplorerItemType.PROJECT]: CrgProject;

  [ExplorerItemType.LIBRARY_ROOT]: null;
  [ExplorerItemType.LIBRARY]: Library;
  [ExplorerItemType.FOLDER]: LibraryRecord;
  [ExplorerItemType.DOCUMENT]: LibraryRecord;
  [ExplorerItemType.FILE]: FileInfo;

  [ExplorerItemType.DOCUMENT_VERSIONS_ROOT]: LibraryRecord;
  [ExplorerItemType.DOCUMENT_VERSION]: DocumentVersionExtended;

  [ExplorerItemType.BASEMAPS_ROOT]: null;
  [ExplorerItemType.BASEMAP]: Basemap;

  [ExplorerItemType.TASKS_ROOT]: null;
  [ExplorerItemType.TASK_HISTORY_ROOT]: Task;
  [ExplorerItemType.TASK_HISTORY]: TaskHistory;

  [ExplorerItemType.SEARCH_RESULT_ROOT]: ExplorerSearchValue;
  [ExplorerItemType.SEARCH_ITEM]: SearchItemData;

  [ExplorerItemType.MESSAGES_REGISTRIES_ROOT]: null;
  [ExplorerItemType.MESSAGES_REGISTRY]: MessagesRegistry;

  [ExplorerItemType.SCHEMAS_ROOT]: null;
  [ExplorerItemType.SCHEMA]: Schema;
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

export interface ExplorerSearchValue {
  searchValue?: string;
  path?: ExplorerItemData[];
  breadcrumbSearchValue?: string;
  source?: SearchItemDataSource[];
  type?: FtsType;
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

export interface Adapter<T = ValueOf<ExplorerItemPayloads>, C = ValueOf<ExplorerItemPayloads>> {
  getId: (item: ExplorerItemData<T>) => string;
  getTitle: (item: ExplorerItemData<T>, store: ExplorerStore) => ReactNode;
  getMeta: (item: ExplorerItemData<T>) => string;
  getDescription?: (item: ExplorerItemData<T>) => ReactNode;
  getIcon?: (item: ExplorerItemData<T>) => ReactNode;
  additionalInfo?: (item: ExplorerItemData<T>) => ReactNode;
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
    type: ExplorerItemType,
    store: ExplorerStore
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
  hasSearch?: () => boolean;
}
