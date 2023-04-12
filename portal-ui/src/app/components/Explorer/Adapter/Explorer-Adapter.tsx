import React, { ReactNode } from 'react';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';

import { DataChangeEventDetail } from '../../../services/communication.service';
import { PageOptions, SortOrder } from '../../../services/models';
import { Emitter } from '../../../services/common/Emitter';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';

import { ExplorerStore } from '../Explorer.store';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../Explorer.models';
import { ExplorerAdapterTypeDatasetRoot } from './_type/Explorer-Adapter_type_datasetRoot';
import { ExplorerAdapterTypeDataset } from './_type/Explorer-Adapter_type_dataset';
import { ExplorerAdapterTypeDocument } from './_type/Explorer-Adapter_type_document';
import { ExplorerAdapterTypeFolder } from './_type/Explorer-Adapter_type_folder';
import { ExplorerAdapterTypeLibrary } from './_type/Explorer-Adapter_type_library';
import { ExplorerAdapterTypeLibraryRoot } from './_type/Explorer-Adapter_type_libraryRoot';
import { ExplorerAdapterTypeRoot } from './_type/Explorer-Adapter_type_root';
import { ExplorerAdapterTypeTable } from './_type/Explorer-Adapter_type_table';
import { ExplorerAdapterTypeNone } from './_type/Explorer-Adapter_type_none';
import { ExplorerAdapterTypeProject } from './_type/Explorer-Adapter_type_project';
import { ExplorerAdapterTypeProjectsRoot } from './_type/Explorer-Adapter_type_projectsRoot';
import { ExplorerAdapterTypeBasemap } from './_type/Explorer-Adapter_type_basemap';
import { ExplorerAdapterTypeBasemapsRoot } from './_type/Explorer-Adapter_type_basemapsRoot';
import { ExplorerAdapterTypeSchema } from './_type/Explorer-Adapter_type_schema';
import { ExplorerAdapterTypeSchemasRoot } from './_type/Explorer-Adapter_type_schemasRoot';
import { ExplorerAdapterTypeFile } from './_type/Explorer-Adapter_type_file';
import { ExplorerAdapterTypeMessagesRegistriesRoot } from './_type/Explorer-Adapter_type_messagesRegistriesRoot';
import { ExplorerAdapterTypeMessagesRegistry } from './_type/Explorer-Adapter_type_messagesRegistries';
import { ExplorerService } from '../Explorer.service';

const adapters: { [key in ExplorerItemType]: Adapter } = {
  [ExplorerItemType.NONE]: ExplorerAdapterTypeNone,
  [ExplorerItemType.DATASET]: ExplorerAdapterTypeDataset,
  [ExplorerItemType.TABLE]: ExplorerAdapterTypeTable,
  [ExplorerItemType.LIBRARY]: ExplorerAdapterTypeLibrary,
  [ExplorerItemType.FOLDER]: ExplorerAdapterTypeFolder,
  [ExplorerItemType.DOCUMENT]: ExplorerAdapterTypeDocument,
  [ExplorerItemType.FILE]: ExplorerAdapterTypeFile,
  [ExplorerItemType.DATASET_ROOT]: ExplorerAdapterTypeDatasetRoot,
  [ExplorerItemType.LIBRARY_ROOT]: ExplorerAdapterTypeLibraryRoot,
  [ExplorerItemType.ROOT]: ExplorerAdapterTypeRoot,
  [ExplorerItemType.PROJECT]: ExplorerAdapterTypeProject,
  [ExplorerItemType.PROJECTS_ROOT]: ExplorerAdapterTypeProjectsRoot,
  [ExplorerItemType.BASEMAP]: ExplorerAdapterTypeBasemap,
  [ExplorerItemType.BASEMAPS_ROOT]: ExplorerAdapterTypeBasemapsRoot,
  [ExplorerItemType.MESSAGES_REGISTRIES_ROOT]: ExplorerAdapterTypeMessagesRegistriesRoot,
  [ExplorerItemType.MESSAGES_REGISTRY]: ExplorerAdapterTypeMessagesRegistry,
  [ExplorerItemType.SCHEMA]: ExplorerAdapterTypeSchema,
  [ExplorerItemType.SCHEMAS_ROOT]: ExplorerAdapterTypeSchemasRoot
};

const lackOfRightMessage = 'Недостаточно прав';
const objectNotFound = 'Объект не найден';

export function getId(item: ExplorerItemData): string {
  return adapters[item.type].getId(item);
}

export function getTitle(item: ExplorerItemData): ReactNode {
  return adapters[item.type].getTitle(item);
}

export function getDescription(item: ExplorerItemData): ReactNode {
  return adapters[item.type].getDescription && adapters[item.type].getDescription(item);
}

export function getMeta(item: ExplorerItemData): string {
  return adapters[item.type].getMeta(item);
}

export function getIcon(item: ExplorerItemData): ReactNode {
  return adapters[item.type].getIcon ? adapters[item.type].getIcon(item) : <InsertDriveFileOutlined />;
}

export function isFolder(item: ExplorerItemData): boolean {
  return adapters[item.type].isFolder(item);
}

export function customOpenActionIcon(item: ExplorerItemData): ReactNode {
  return adapters[item.type].customOpenActionIcon && adapters[item.type].customOpenActionIcon(item);
}

export function customOpenAction(item: ExplorerItemData): void {
  return adapters[item.type].customOpenAction && adapters[item.type].customOpenAction(item);
}

export async function getChildren(
  item: ExplorerItemData,
  pageOptions: PageOptions,
  store: ExplorerStore,
  service: ExplorerService
): Promise<[ExplorerItemData[], number] | undefined> {
  if (isFolder(item) && adapters[item.type].getChildren) {
    try {
      return await adapters[item.type].getChildren(item, pageOptions, store, service);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = 'Элементы не найдены';
      let details: ReactNode = (
        <>
          Не найдены элементы для {getTitle(item)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = <>Недостаточно прав для просмотра элементов {getTitle(item)}</>;
      }

      services.logger?.error(message, error);
      Toast.warn({ message, details });

      return [[], 1];
    }
  }
}

export async function getChildrenWithParticularOne(
  item: ExplorerItemData,
  pageOptions: PageOptions,
  id: string,
  store: ExplorerStore,
  service: ExplorerService
): Promise<[ExplorerItemData[], number, number]> | undefined {
  if (adapters[item.type].getChildrenWithParticularOne) {
    try {
      return await adapters[item.type].getChildrenWithParticularOne(item, pageOptions, id, store, service);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = objectNotFound;
      let details: ReactNode = (
        <>
          Не найден объект для {getTitle(item)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = <>Недостаточно прав для просмотра элементов {getTitle(item)}</>;
      }

      services.logger.error(message, error);
      Toast.warn({ message, details });
    }
  }
}

export function getChildrenSortItems(item: ExplorerItemData): SortItem[] | undefined {
  return adapters[item.type].getChildrenSortItems && adapters[item.type].getChildrenSortItems(item);
}

export async function getChildById(
  item: ExplorerItemData,
  id: string,
  type: ExplorerItemType
): Promise<ExplorerItemData | undefined> {
  if (adapters[item.type].getChildById) {
    try {
      return await adapters[item.type].getChildById(item, id, type);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = objectNotFound;
      let details: ReactNode = (
        <>
          Объект [${id}] не найден в {getTitle(item)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = (
          <>
            Недостаточно прав для просмотра [${id}] в {getTitle(item)}
          </>
        );
      }

      services.logger.error(message, error);
      Toast.warn({ message, details });
    }
  }
}

export function getChildrenSortDefaultValue(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenSortDefaultValue && adapters[item.type].getChildrenSortDefaultValue(item);
}

export function getChildrenSortDefaultOrder(item: ExplorerItemData): SortOrder | undefined {
  return adapters[item.type].getChildrenSortDefaultOrder && adapters[item.type].getChildrenSortDefaultOrder(item);
}

export function getChildrenFilterField(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenFilterField && adapters[item.type].getChildrenFilterField(item);
}

export function getChildrenFilterLabel(item: ExplorerItemData): string | undefined {
  return adapters[item.type].getChildrenFilterLabel && adapters[item.type].getChildrenFilterLabel(item);
}

export function getToolbarActions(
  item: ExplorerItemData,
  store: ExplorerStore,
  service: ExplorerService,
  full: boolean
): Promise<ReactNode> | ReactNode | undefined {
  return adapters[item.type].getToolbarActions && adapters[item.type].getToolbarActions(item, store, service, full);
}

export function getRefreshEmitters(item: ExplorerItemData): Emitter<DataChangeEventDetail<unknown>>[] {
  return (adapters[item.type].getRefreshEmitters && adapters[item.type].getRefreshEmitters(item)) || [];
}

export function getActions(item: ExplorerItemData): ReactNode | undefined {
  return adapters[item.type].getActions && adapters[item.type].getActions(item);
}
