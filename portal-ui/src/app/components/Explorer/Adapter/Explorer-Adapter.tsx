import React, { ReactNode } from 'react';
import { InsertDriveFileOutlined } from '@material-ui/icons';

import { services } from '../../../services/services';
import { SortDir } from '../../../services/models';
import { Emitter } from '../../../services/util/Emitter';
import { Toast } from '../../Toast/Toast';

import { ExplorerItemData, ExplorerItemType, SortItem } from '../Explorer.models';
import { ExplorerAdapterTypeDataSetRoot } from './_type/Explorer-Adapter_type_dataSetRoot';
import { ExplorerAdapterTypeDataSet } from './_type/Explorer-Adapter_type_dataSet';
import { ExplorerAdapterTypeDocument } from './_type/Explorer-Adapter_type_document';
import { ExplorerAdapterTypeFolder } from './_type/Explorer-Adapter_type_folder';
import { ExplorerAdapterTypeLibrary } from './_type/Explorer-Adapter_type_library';
import { ExplorerAdapterTypeLibraryRoot } from './_type/Explorer-Adapter_type_libraryRoot';
import { ExplorerAdapterTypeRoot } from './_type/Explorer-Adapter_type_root';
import { ExplorerAdapterTypeTable } from './_type/Explorer-Adapter_type_table';
import { ExplorerAdapterTypeEmpty } from './_type/Explorer-Adapter_type_empty';
import { ExplorerAdapterTypeProject } from './_type/Explorer-Adapter_type_project';
import { ExplorerAdapterTypeProjectsRoot } from './_type/Explorer-Adapter_type_projectsRoot';

export interface Adapter {
  getId: (item: ExplorerItemData) => string;
  getTitle: (item: ExplorerItemData) => ReactNode;
  getMeta: (item: ExplorerItemData) => string;
  getDetails?: (item: ExplorerItemData) => string;
  getIcon?: (item: ExplorerItemData) => ReactNode;
  isFolder: (item: ExplorerItemData) => boolean;
  getChildren?: (
    item: ExplorerItemData,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
  ) => Promise<[ExplorerItemData[], number]>;
  getChildrenSortItems?: (item: ExplorerItemData) => SortItem[];
  getChildrenSortDefaultValue?: (item: ExplorerItemData) => string;
  getChildrenSortDefaultDirection?: (item: ExplorerItemData) => SortDir;
  getChildrenFilterField?: (item: ExplorerItemData) => string;
  getChildrenFilterLabel?: (item: ExplorerItemData) => string;
  getToolbarActions?: (item: ExplorerItemData) => ReactNode;
  getEmptyListView?: (item: ExplorerItemData) => ReactNode;
  getRefreshEmitters?: (item: ExplorerItemData) => Emitter[];
}

const adapters: { [key in ExplorerItemType]: Adapter } = {
  [ExplorerItemType.EMPTY]: ExplorerAdapterTypeEmpty,
  [ExplorerItemType.DATA_SET]: ExplorerAdapterTypeDataSet,
  [ExplorerItemType.TABLE]: ExplorerAdapterTypeTable,
  [ExplorerItemType.LIBRARY]: ExplorerAdapterTypeLibrary,
  [ExplorerItemType.FOLDER]: ExplorerAdapterTypeFolder,
  [ExplorerItemType.DOCUMENT]: ExplorerAdapterTypeDocument,
  [ExplorerItemType.DATA_SET_ROOT]: ExplorerAdapterTypeDataSetRoot,
  [ExplorerItemType.LIBRARY_ROOT]: ExplorerAdapterTypeLibraryRoot,
  [ExplorerItemType.ROOT]: ExplorerAdapterTypeRoot,
  [ExplorerItemType.PROJECT]: ExplorerAdapterTypeProject,
  [ExplorerItemType.PROJECTS_ROOT]: ExplorerAdapterTypeProjectsRoot
};

export function getId(item: ExplorerItemData): string {
  return adapters[item.type].getId(item);
}

export function getTitle(item: ExplorerItemData): ReactNode {
  return adapters[item.type].getTitle(item);
}

export function getMeta(item: ExplorerItemData): string {
  return adapters[item.type].getMeta(item);
}

export function getDetails(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getDetails && adapters[item.type].getDetails(item);
}

export function getIcon(item: ExplorerItemData): ReactNode {
  return adapters[item.type].getIcon ? adapters[item.type].getIcon(item) : <InsertDriveFileOutlined />;
}

export function isFolder(item: ExplorerItemData): boolean {
  return adapters[item.type].isFolder(item);
}

export async function getChildren(
  item: ExplorerItemData,
  page: number,
  pageSize: number,
  sort?: string,
  sortDir?: SortDir,
  filter?: { [key: string]: string }
): Promise<[ExplorerItemData[], number] | undefined> {
  if (isFolder(item) && adapters[item.type].getChildren) {
    try {
      return await adapters[item.type].getChildren(item, page, pageSize, sort, sortDir, filter);
    } catch (e) {
      const message = `Ошибка получения списка элементов для "${getTitle(item)}"`;
      services.logger.error(message, e);
      Toast.error({ message, details: e.message });

      return [[], 1];
    }
  }
}

export function getChildrenSortItems(item: ExplorerItemData): SortItem[] | undefined {
  return adapters[item.type].getChildrenSortItems && adapters[item.type].getChildrenSortItems(item);
}

export function getChildrenSortDefaultValue(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenSortDefaultValue && adapters[item.type].getChildrenSortDefaultValue(item);
}

export function getChildrenSortDefaultDirection(item: ExplorerItemData): SortDir | undefined {
  return (
    adapters[item.type].getChildrenSortDefaultDirection && adapters[item.type].getChildrenSortDefaultDirection(item)
  );
}

export function getChildrenFilterField(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenFilterField && adapters[item.type].getChildrenFilterField(item);
}

export function getChildrenFilterLabel(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenFilterLabel && adapters[item.type].getChildrenFilterLabel(item);
}

export function getToolbarActions(item: ExplorerItemData): ReactNode | undefined {
  return adapters[item.type].getToolbarActions && adapters[item.type].getToolbarActions(item);
}

export function getEmptyListView(item: ExplorerItemData): ReactNode | undefined {
  return adapters[item.type].getEmptyListView && adapters[item.type].getEmptyListView(item);
}

export function getRefreshEmitters(item: ExplorerItemData): Emitter[] {
  return (adapters[item.type].getRefreshEmitters && adapters[item.type].getRefreshEmitters(item)) || [];
}
