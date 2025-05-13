import { ReactNode } from 'react';

import { FtsType } from '../../../server-types/common-contracts';
import { Emitter } from '../../services/common/Emitter';
import { DataChangeEventDetail } from '../../services/communication.service';
import { Basemap } from '../../services/data/basemaps/basemaps.models';
import { FileInfo } from '../../services/data/files/files.models';
import { DocumentVersionExtended, Library, LibraryRecord } from '../../services/data/library/library.models';
import { MessagesRegistry } from '../../services/data/messagesRegistries/messagesRegistries.models';
import { Schema } from '../../services/data/schema/schema.models';
import { SearchItemData, SearchItemDataSource } from '../../services/data/search/search.model';
import { Task, TaskHistory } from '../../services/data/task/task.models';
import { Dataset, VectorTable } from '../../services/data/vectorData/vectorData.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { PageOptions, SortOrder, ValueOf } from '../../services/models';
import { FilterQuery } from '../../services/util/filters/filters.models';
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
  | 'FolderPreview'
  | 'SelectProjectFromExplorer'
  | '';

export enum ExplorerItemType {
  NONE = 'none',
  ROOT = 'r',

  DATASET_ROOT = 'dr',
  DATASET = 'dataset',
  TABLE = 'table',

  PROJECTS_ROOT = 'pr',
  PROJECT = 'project',
  PROJECT_FOLDER = 'prf',

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

export interface ExplorerItemDataAllTypes {
  [ExplorerItemType.NONE]: { type: ExplorerItemType.NONE; payload: { loading?: boolean } };
  [ExplorerItemType.ROOT]: { type: ExplorerItemType.ROOT; payload: null };

  [ExplorerItemType.DATASET_ROOT]: { type: ExplorerItemType.DATASET_ROOT; payload: null };
  [ExplorerItemType.DATASET]: { type: ExplorerItemType.DATASET; payload: Dataset };
  [ExplorerItemType.TABLE]: { type: ExplorerItemType.TABLE; payload: VectorTable };

  [ExplorerItemType.PROJECTS_ROOT]: { type: ExplorerItemType.PROJECTS_ROOT; payload: null };
  [ExplorerItemType.PROJECT_FOLDER]: { type: ExplorerItemType.PROJECT_FOLDER; payload: CrgProject };
  [ExplorerItemType.PROJECT]: { type: ExplorerItemType.PROJECT; payload: CrgProject };

  [ExplorerItemType.LIBRARY_ROOT]: { type: ExplorerItemType.LIBRARY_ROOT; payload: null };
  [ExplorerItemType.LIBRARY]: { type: ExplorerItemType.LIBRARY; payload: Library };
  [ExplorerItemType.FOLDER]: { type: ExplorerItemType.FOLDER; payload: LibraryRecord };
  [ExplorerItemType.DOCUMENT]: { type: ExplorerItemType.DOCUMENT; payload: LibraryRecord };
  [ExplorerItemType.FILE]: { type: ExplorerItemType.FILE; payload: FileInfo };

  [ExplorerItemType.DOCUMENT_VERSIONS_ROOT]: { type: ExplorerItemType.DOCUMENT_VERSIONS_ROOT; payload: LibraryRecord };
  [ExplorerItemType.DOCUMENT_VERSION]: { type: ExplorerItemType.DOCUMENT_VERSION; payload: DocumentVersionExtended };

  [ExplorerItemType.BASEMAPS_ROOT]: { type: ExplorerItemType.BASEMAPS_ROOT; payload: null };
  [ExplorerItemType.BASEMAP]: { type: ExplorerItemType.BASEMAP; payload: Basemap };

  [ExplorerItemType.TASKS_ROOT]: { type: ExplorerItemType.TASKS_ROOT; payload: null };
  [ExplorerItemType.TASK_HISTORY_ROOT]: { type: ExplorerItemType.TASK_HISTORY_ROOT; payload: Task };
  [ExplorerItemType.TASK_HISTORY]: { type: ExplorerItemType.TASK_HISTORY; payload: TaskHistory };

  [ExplorerItemType.SEARCH_RESULT_ROOT]: { type: ExplorerItemType.SEARCH_RESULT_ROOT; payload: ExplorerSearchValue };
  [ExplorerItemType.SEARCH_ITEM]: { type: ExplorerItemType.SEARCH_ITEM; payload: SearchItemData };

  [ExplorerItemType.MESSAGES_REGISTRIES_ROOT]: { type: ExplorerItemType.MESSAGES_REGISTRIES_ROOT; payload: null };
  [ExplorerItemType.MESSAGES_REGISTRY]: { type: ExplorerItemType.MESSAGES_REGISTRY; payload: MessagesRegistry };

  [ExplorerItemType.SCHEMAS_ROOT]: { type: ExplorerItemType.SCHEMAS_ROOT; payload: null };
  [ExplorerItemType.SCHEMA]: { type: ExplorerItemType.SCHEMA; payload: Schema };
}

export type ExplorerItemData = ValueOf<ExplorerItemDataAllTypes>;

export enum ExplorerItemEntityTypeTitle {
  DATASET = 'набора данных',
  TABLE = 'таблицы',

  LIBRARY = 'библиотеки',
  FOLDER = 'папки',
  DOCUMENT = 'документа',

  PROJECT = 'проекта',
  PROJECT_FOLDER = 'папка проекта'
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

export interface Adapter {
  getId(item: ExplorerItemData, store: ExplorerStore): string;
  getTitle(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  getMeta(item: ExplorerItemData, store: ExplorerStore): string;
  getDescription?(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  getIcon?(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  additionalInfo?(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  isFolder(item: ExplorerItemData, store: ExplorerStore): boolean;
  customOpenActionIcon?(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  customOpenAction?(item: ExplorerItemData, store: ExplorerStore): void;
  getChildren?(
    item: ExplorerItemData,
    pageOptions: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): [ExplorerItemData[], number] | Promise<[ExplorerItemData[], number]>;
  getChildrenWithParticularOne?(
    item: ExplorerItemData,
    pageOptions: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): [ExplorerItemData[], number, number] | Promise<[ExplorerItemData[], number, number] | undefined> | undefined;
  getChildrenSortItems?(item: ExplorerItemData, store: ExplorerStore): SortItem[];
  getChildById?(
    item: ExplorerItemData,
    id: string,
    type: ExplorerItemType,
    store: ExplorerStore
  ): ExplorerItemData | Promise<ExplorerItemData> | undefined;
  getChildrenSortDefaultValue?(item: ExplorerItemData, store: ExplorerStore): string;
  getChildrenSortDefaultOrder?(item: ExplorerItemData, store: ExplorerStore): SortOrder;
  getChildrenFilterField?(item: ExplorerItemData, store: ExplorerStore): string;
  getChildrenFilterLabel?(item: ExplorerItemData, store: ExplorerStore): string;
  getToolbarActions?(
    item: ExplorerItemData,
    store: ExplorerStore,
    service: ExplorerService,
    full: boolean
  ): Promise<ReactNode> | ReactNode;
  getRefreshEmitters?(item: ExplorerItemData, store: ExplorerStore): Emitter<DataChangeEventDetail<unknown>>[];
  getActions?(item: ExplorerItemData, store: ExplorerStore): ReactNode;
  hasSearch?(item: ExplorerItemData, store: ExplorerStore): boolean;
}

export const itemTypeError: Error = new Error('Некорректный тип данных в Explorer');

export function isExplorerItemData(value: unknown): value is ExplorerItemData {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const explorerItemTypeKeys = Object.values(ExplorerItemType).map(String);

  return (
    'payload' in value && 'type' in value && typeof value.type === 'string' && explorerItemTypeKeys.includes(value.type)
  );
}

export function isCustomFilters(value: unknown): value is CustomFilters {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const valueEntries = Object.entries(value);
  const explorerItemTypeKeys = new Set(Object.values(ExplorerItemType).map(String));

  return valueEntries.every(([key, value]) => explorerItemTypeKeys.has(key) && typeof value === 'object');
}
