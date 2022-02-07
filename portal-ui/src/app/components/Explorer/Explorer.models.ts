import React, { ReactNode } from 'react';

import { PageOptions, SortDir } from '../../services/models';
import { Emitter } from '../../services/common/Emitter';

import { ExplorerStore } from './Explorer.store';
import { ExplorerService } from './Explorer.service';
import { ExplorerProps } from './Explorer';

export enum ExplorerItemType {
  EMPTY = 'empty',

  DATASET = 'dataset',
  TABLE = 'table',
  PROJECT = 'project',

  LIBRARY = 'lib',
  FOLDER = 'folder',
  DOCUMENT = 'doc',

  BASEMAP = 'basemap',

  DATASET_ROOT = 'dr',
  LIBRARY_ROOT = 'lr',
  PROJECTS_ROOT = 'pr',
  BASEMAPS_ROOT = 'br',
  ROOT = 'r'
}

export enum ExplorerItemEntityType {
  DATASET = 'набора данных',
  TABLE = 'таблицы',

  LIBRARY = 'библиотеки',
  FOLDER = 'папки',
  DOCUMENT = 'документа'
}

export interface ExplorerItemData<T = ExplorerItemPayloads[ExplorerItemType]> {
  type: ExplorerItemType;
  payload: T;
}

export const emptyItem: ExplorerItemData = { type: ExplorerItemType.EMPTY, payload: {} };
export const loadingItem: ExplorerItemData = { type: ExplorerItemType.EMPTY, payload: { loading: true } };

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
    id: string
  ) => Promise<[ExplorerItemData[], number, number]> | undefined;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildById?: (item: ExplorerItemData, id: string, type: ExplorerItemType) => Promise<ExplorerItemData>;
  getChildrenSortDefaultValue?: (item: ExplorerItemData) => string;
  getChildrenSortDefaultDirection?: (item: ExplorerItemData) => SortDir;
  getChildrenFilterField?: (item: ExplorerItemData) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData) => string;
  getToolbarActions?: (item: ExplorerItemData, store: ExplorerStore, service: ExplorerService) => ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData) => Emitter[];
  getActions?: (item: ExplorerItemData) => ReactNode;
}
