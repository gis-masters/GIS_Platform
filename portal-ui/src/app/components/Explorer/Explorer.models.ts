import React, { ReactNode } from 'react';
import { ButtonProps } from '@mui/material';

import { PageOptions, SortDir } from '../../services/models';
import { Emitter } from '../../services/common/Emitter';

import { ExplorerStore } from './Explorer.store';
import { ExplorerProps, ExplorerUrlItem } from './Explorer';

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

export enum ExplorerItemEntityType {
  DATASET = 'набора данных',
  TABLE = 'табилцы',

  LIBRARY = 'библиотеки',
  FOLDER = 'папки',
  DOCUMENT = 'документа'
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
  getWidgets?: (item: ExplorerItemData, Explorer: React.ComponentType<ExplorerProps>) => Promise<ReactNode>;
  getDescription?: (item: ExplorerItemData) => ReactNode;
  getIcon?: (item: ExplorerItemData) => ReactNode;
  isFolder: (item: ExplorerItemData) => boolean;
  getChildren?: (item: ExplorerItemData, pageOptions: PageOptions) => Promise<[ExplorerItemData[], number]>;
  getChildrenWithParticularOne?: (
    item: ExplorerItemData,
    pageOptions: PageOptions,
    urlItem: ExplorerUrlItem
  ) => Promise<[ExplorerItemData[], number, number]> | undefined;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildById?: (item: ExplorerItemData, id: string, type: ExplorerItemType) => Promise<ExplorerItemData>;
  getChildrenSortDefaultValue?: (item: ExplorerItemData) => string;
  getChildrenSortDefaultDirection?: (item: ExplorerItemData) => SortDir;
  getChildrenFilterField?: (item: ExplorerItemData) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData) => string;
  getToolbarActions?: (item: ExplorerItemData, store: ExplorerStore) => ReactNode;
  getEmptyListView?: (item: ExplorerItemData) => ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData) => Emitter[];
  getAllowedActions?: (item: ExplorerItemData) => Promise<AllowedActions>;
  deleteItem?: (item: ExplorerItemData) => Promise<void>;
  isDeleteAllowed?: (item: ExplorerItemData) => Promise<AllowedDetails>;
}

enum ActionType {
  DELETE = 'delete',
  DOWNLOAD = 'download',
  INTEGRATION_SED = 'integration_sed'
}

export type AllowedActions = { [key in ActionType]?: ActionDetails };

export interface ActionDetails {
  visible?: boolean;
  disabled?: boolean;
  needConfirmation?: boolean;
  confirmationText?: string;
  text?: string;
  title?: string;
  itemTitle?: string;
  confirmationMood?: 'normal' | 'warning';
  url?: string;
  fileName?: string;
  btnProps?: Omit<Partial<ButtonProps>, 'ref'>;
}

export interface AllowedDetails {
  ok: boolean;
  errorMessage?: string;
}
