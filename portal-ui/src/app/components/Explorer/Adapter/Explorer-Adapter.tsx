import React, { ReactNode } from 'react';
import { InsertDriveFileOutlined } from '@mui/icons-material';
import { AxiosError } from 'axios';

import { Emitter } from '../../../services/common/Emitter';
import { DataChangeEventDetail } from '../../../services/communication.service';
import { PageOptions, SortOrder } from '../../../services/models';
import { services } from '../../../services/services';
import { Toast } from '../../Toast/Toast';
import { Adapter, ExplorerItemData, ExplorerItemDataAllTypes, ExplorerItemType, SortItem } from '../Explorer.models';
import { ExplorerService } from '../Explorer.service';
import { ExplorerStore } from '../Explorer.store';
import { ExplorerAdapterTypeBasemap } from './_type/Explorer-Adapter_type_basemap';
import { ExplorerAdapterTypeBasemapsRoot } from './_type/Explorer-Adapter_type_basemapsRoot';
import { ExplorerAdapterTypeDataset } from './_type/Explorer-Adapter_type_dataset';
import { ExplorerAdapterTypeDatasetRoot } from './_type/Explorer-Adapter_type_datasetRoot';
import { ExplorerAdapterTypeDocument } from './_type/Explorer-Adapter_type_document';
import { ExplorerAdapterTypeDocumentVersion } from './_type/Explorer-Adapter_type_documentVersion';
import { ExplorerAdapterTypeDocumentVersionsRoot } from './_type/Explorer-Adapter_type_documentVersionsRoot';
import { ExplorerAdapterTypeFile } from './_type/Explorer-Adapter_type_file';
import { ExplorerAdapterTypeFolder } from './_type/Explorer-Adapter_type_folder';
import { ExplorerAdapterTypeLibrary } from './_type/Explorer-Adapter_type_library';
import { ExplorerAdapterTypeLibraryRoot } from './_type/Explorer-Adapter_type_libraryRoot';
import { ExplorerAdapterTypeMessagesRegistriesRoot } from './_type/Explorer-Adapter_type_messagesRegistriesRoot';
import { ExplorerAdapterTypeMessagesRegistry } from './_type/Explorer-Adapter_type_messagesRegistry';
import { ExplorerAdapterTypeNone } from './_type/Explorer-Adapter_type_none';
import { ExplorerAdapterTypeProject } from './_type/Explorer-Adapter_type_project';
import { ExplorerAdapterTypeProjectFolder } from './_type/Explorer-Adapter_type_projectFolder';
import { ExplorerAdapterTypeProjectsRoot } from './_type/Explorer-Adapter_type_projectsRoot';
import { ExplorerAdapterTypeRoot } from './_type/Explorer-Adapter_type_root';
import { ExplorerAdapterTypeSchema } from './_type/Explorer-Adapter_type_schema';
import { ExplorerAdapterTypeSchemasRoot } from './_type/Explorer-Adapter_type_schemasRoot';
import { ExplorerAdapterTypeSearchItem } from './_type/Explorer-Adapter_type_searchItem';
import { ExplorerAdapterTypeSearchResultRoot } from './_type/Explorer-Adapter_type_searchResultRoot';
import { ExplorerAdapterTypeTable } from './_type/Explorer-Adapter_type_table';
import { ExplorerAdapterTypeTaskHistory } from './_type/Explorer-Adapter_type_taskHistory';
import { ExplorerAdapterTypeTaskHistoryRoot } from './_type/Explorer-Adapter_type_taskHistoryRoot';
import { ExplorerAdapterTypeTasksRoot } from './_type/Explorer-Adapter_type_taskRoot';

const adapters: Record<keyof ExplorerItemDataAllTypes, Adapter> = {
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
  [ExplorerItemType.PROJECT_FOLDER]: ExplorerAdapterTypeProjectFolder,
  [ExplorerItemType.BASEMAP]: ExplorerAdapterTypeBasemap,
  [ExplorerItemType.BASEMAPS_ROOT]: ExplorerAdapterTypeBasemapsRoot,
  [ExplorerItemType.MESSAGES_REGISTRIES_ROOT]: ExplorerAdapterTypeMessagesRegistriesRoot,
  [ExplorerItemType.MESSAGES_REGISTRY]: ExplorerAdapterTypeMessagesRegistry,
  [ExplorerItemType.SCHEMA]: ExplorerAdapterTypeSchema,
  [ExplorerItemType.SCHEMAS_ROOT]: ExplorerAdapterTypeSchemasRoot,
  [ExplorerItemType.DOCUMENT_VERSIONS_ROOT]: ExplorerAdapterTypeDocumentVersionsRoot,
  [ExplorerItemType.DOCUMENT_VERSION]: ExplorerAdapterTypeDocumentVersion,
  [ExplorerItemType.TASKS_ROOT]: ExplorerAdapterTypeTasksRoot,
  [ExplorerItemType.TASK_HISTORY_ROOT]: ExplorerAdapterTypeTaskHistoryRoot,
  [ExplorerItemType.TASK_HISTORY]: ExplorerAdapterTypeTaskHistory,
  [ExplorerItemType.SEARCH_RESULT_ROOT]: ExplorerAdapterTypeSearchResultRoot,
  [ExplorerItemType.SEARCH_ITEM]: ExplorerAdapterTypeSearchItem
};

const lackOfRightMessage = 'Недостаточно прав';
const objectNotFound = 'Объект не найден';

export function getId(item: ExplorerItemData, store: ExplorerStore): string {
  if (store.adaptersOverride[item.type]?.getId) {
    return store.adaptersOverride[item.type].getId?.(item, store) || '';
  }

  return adapters[item.type].getId(item, store);
}

export function getTitle(item: ExplorerItemData, store: ExplorerStore): ReactNode {
  if (store.adaptersOverride[item.type]?.getTitle) {
    return store.adaptersOverride[item.type].getTitle?.(item, store);
  }

  return adapters[item.type].getTitle(item, store);
}

export function getDescription(item: ExplorerItemData, store: ExplorerStore): ReactNode {
  if (store.adaptersOverride[item.type]?.getDescription) {
    return store.adaptersOverride[item.type].getDescription?.(item, store);
  }

  return adapters[item.type].getDescription?.(item, store);
}

export function getMeta(item: ExplorerItemData, store: ExplorerStore): string {
  if (store.adaptersOverride[item.type]?.getMeta) {
    return store.adaptersOverride[item.type].getMeta?.(item, store) || '';
  }

  return adapters[item.type].getMeta(item, store);
}

export function getIcon(item: ExplorerItemData, store: ExplorerStore): ReactNode {
  if (store.adaptersOverride[item.type]?.getIcon) {
    return store.adaptersOverride[item.type].getIcon?.(item, store);
  }

  return adapters[item.type].getIcon?.(item, store) || <InsertDriveFileOutlined />;
}

export function additionalInfo(item: ExplorerItemData, store: ExplorerStore): ReactNode {
  if (store.adaptersOverride[item.type]?.additionalInfo) {
    return store.adaptersOverride[item.type].additionalInfo?.(item, store);
  }

  return adapters[item.type].additionalInfo?.(item, store);
}

export function isFolder(item: ExplorerItemData, store: ExplorerStore): boolean {
  if (store.adaptersOverride[item.type]?.isFolder) {
    return store.adaptersOverride[item.type].isFolder?.(item, store) || false;
  }

  return adapters[item.type].isFolder(item, store);
}

export function customOpenActionIcon(item: ExplorerItemData, store: ExplorerStore): ReactNode {
  if (store.adaptersOverride[item.type]?.customOpenActionIcon) {
    return store.adaptersOverride[item.type].customOpenActionIcon?.(item, store);
  }

  return adapters[item.type].customOpenActionIcon?.(item, store);
}

export function customOpenAction(item: ExplorerItemData, store: ExplorerStore): void {
  if (store.adaptersOverride[item.type]?.customOpenAction) {
    return store.adaptersOverride[item.type].customOpenAction?.(item, store);
  }

  return adapters[item.type].customOpenAction?.(item, store);
}

export async function getChildren(
  item: ExplorerItemData,
  pageOptions: PageOptions,
  store: ExplorerStore,
  service: ExplorerService
): Promise<[ExplorerItemData[], number] | undefined> {
  if (store.adaptersOverride[item.type]?.getChildren) {
    return store.adaptersOverride[item.type].getChildren?.(item, pageOptions, store, service);
  }

  if (isFolder(item, store) && adapters[item.type].getChildren) {
    try {
      return await adapters[item.type].getChildren?.(item, pageOptions, store, service);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = 'Элементы не найдены';
      let details: ReactNode = (
        <>
          Не найдены элементы для {getTitle(item, store)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = <>Недостаточно прав для просмотра элементов {getTitle(item, store)}</>;
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
): Promise<[ExplorerItemData[], number, number] | undefined> {
  if (store.adaptersOverride[item.type]?.getChildrenWithParticularOne) {
    return store.adaptersOverride[item.type].getChildrenWithParticularOne?.(item, pageOptions, id, store, service);
  }

  if (adapters[item.type].getChildrenWithParticularOne) {
    try {
      return await adapters[item.type].getChildrenWithParticularOne?.(item, pageOptions, id, store, service);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = objectNotFound;
      let details: ReactNode = (
        <>
          Не найден объект для {getTitle(item, store)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = <>Недостаточно прав для просмотра элементов {getTitle(item, store)}</>;
      }

      services.logger.error(message, error);
      Toast.warn({ message, details });
    }
  }
}

export function getChildrenSortItems(item: ExplorerItemData, store: ExplorerStore): SortItem[] | undefined {
  if (store.adaptersOverride[item.type]?.getChildrenSortItems) {
    return store.adaptersOverride[item.type].getChildrenSortItems?.(item, store);
  }

  return adapters[item.type].getChildrenSortItems?.(item, store);
}

export async function getChildById(
  item: ExplorerItemData,
  id: string,
  type: ExplorerItemType,
  store: ExplorerStore
): Promise<ExplorerItemData | undefined> {
  if (adapters[item.type].getChildById) {
    try {
      return await adapters[item.type].getChildById?.(item, id, type, store);
    } catch (error) {
      const err = error as AxiosError;

      let message: ReactNode = objectNotFound;
      let details: ReactNode = (
        <>
          Объект [${id}] не найден в {getTitle(item, store)}. {(error as Error).message}
        </>
      );

      if (err?.response?.status === 403) {
        message = lackOfRightMessage;
        details = (
          <>
            Недостаточно прав для просмотра [${id}] в {getTitle(item, store)}
          </>
        );
      }

      services.logger.error(message, error);
      Toast.warn({ message, details });
    }
  }
}

export function getChildrenSortDefaultValue(item: ExplorerItemData, store: ExplorerStore): string | undefined {
  if (store.adaptersOverride[item.type]?.getChildrenSortDefaultValue) {
    return store.adaptersOverride[item.type].getChildrenSortDefaultValue?.(item, store);
  }

  return adapters[item.type].getChildrenSortDefaultValue?.(item, store);
}

export function getChildrenSortDefaultOrder(item: ExplorerItemData, store: ExplorerStore): SortOrder | undefined {
  if (store.adaptersOverride[item.type]?.getChildrenSortDefaultOrder) {
    return store.adaptersOverride[item.type].getChildrenSortDefaultOrder?.(item, store);
  }

  return adapters[item.type].getChildrenSortDefaultOrder?.(item, store);
}

export function getChildrenFilterField(item: ExplorerItemData, store: ExplorerStore): string | undefined {
  if (store.adaptersOverride[item.type]?.getChildrenFilterField) {
    return store.adaptersOverride[item.type].getChildrenFilterField?.(item, store);
  }

  return adapters[item.type].getChildrenFilterField?.(item, store);
}

export function getChildrenFilterLabel(item: ExplorerItemData, store: ExplorerStore): string | undefined {
  if (store.adaptersOverride[item.type]?.getChildrenFilterLabel) {
    return store.adaptersOverride[item.type].getChildrenFilterLabel?.(item, store);
  }

  return adapters[item.type].getChildrenFilterLabel?.(item, store);
}

export function getToolbarActions(
  item: ExplorerItemData,
  store: ExplorerStore,
  service: ExplorerService,
  full: boolean
): Promise<ReactNode> | ReactNode | undefined {
  if (store.adaptersOverride[item.type]?.getToolbarActions) {
    return store.adaptersOverride[item.type].getToolbarActions?.(item, store, service, full);
  }

  return adapters[item.type].getToolbarActions?.(item, store, service, full);
}

export function getRefreshEmitters(
  item: ExplorerItemData,
  store: ExplorerStore
): Emitter<DataChangeEventDetail<unknown>>[] {
  if (store.adaptersOverride[item.type]?.getRefreshEmitters) {
    return store.adaptersOverride[item.type].getRefreshEmitters?.(item, store) || [];
  }

  return adapters[item.type].getRefreshEmitters?.(item, store) || [];
}

export function getActions(item: ExplorerItemData, store: ExplorerStore): ReactNode | undefined {
  if (store.adaptersOverride[item.type]?.getActions) {
    return store.adaptersOverride[item.type].getActions?.(item, store);
  }

  return adapters[item.type].getActions?.(item, store);
}

export function hasSearch(item: ExplorerItemData, store: ExplorerStore): boolean {
  if (store.adaptersOverride[item.type]?.hasSearch) {
    return store.adaptersOverride[item.type].hasSearch?.(item, store) || true;
  }

  return adapters[item.type].hasSearch?.(item, store) || false;
}
