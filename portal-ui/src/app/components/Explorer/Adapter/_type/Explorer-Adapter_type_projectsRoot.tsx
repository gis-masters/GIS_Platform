import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { Emitter } from '../../../../services/common/Emitter';
import { communicationService, DataChangeEventDetail } from '../../../../services/communication.service';
import { CrgProject } from '../../../../services/gis/projects/projects.models';
import { projectsService } from '../../../../services/gis/projects/projects.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateProject } from '../../../CreateProject/CreateProject';
import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProjectsRoot {
  static getId(): string {
    return 'projectsRoot';
  }

  static getTitle(): string {
    return 'Проекты';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <MapOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number]> {
    const [projects, pagesCount] = await projectsService.getProjects({
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    const mappedItems = projects.map(payload => ({
      type: payload.folder ? ExplorerItemType.PROJECT_FOLDER : ExplorerItemType.PROJECT,
      payload
    }));

    // Сортируем так, чтобы папки (PROJECT_FOLDER) шли первыми
    const sortedItems = [...mappedItems].sort((a, b) => {
      if (a.type === ExplorerItemType.PROJECT_FOLDER && b.type !== ExplorerItemType.PROJECT_FOLDER) {
        return -1;
      }
      if (a.type !== ExplorerItemType.PROJECT_FOLDER && b.type === ExplorerItemType.PROJECT_FOLDER) {
        return 1;
      }

      return 0;
    }) as ExplorerItemData[];

    return [sortedItems, pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData[], number, number] | undefined> {
    const response = await projectsService.getProjectsWithParticularOne(id, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    if (!response) {
      return;
    }

    const [libraries, totalPages, pageNumber] = response;

    const mappedItems = libraries.map(payload => ({
      type: payload.folder ? ExplorerItemType.PROJECT_FOLDER : ExplorerItemType.PROJECT,
      payload
    }));

    // Сортируем так, чтобы папки (PROJECT_FOLDER) шли первыми
    const sortedItems = [...mappedItems].sort((a, b) => {
      if (a.type === ExplorerItemType.PROJECT_FOLDER && b.type !== ExplorerItemType.PROJECT_FOLDER) {
        return -1;
      }
      if (a.type !== ExplorerItemType.PROJECT_FOLDER && b.type === ExplorerItemType.PROJECT_FOLDER) {
        return 1;
      }

      return 0;
    }) as ExplorerItemData[];

    return [sortedItems, totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData> {
    const project = await projectsService.getById(Number(id));

    if (!project) {
      throw new Error(`Проект ${id} не найден`);
    }

    return {
      type: project.folder ? ExplorerItemType.PROJECT_FOLDER : ExplorerItemType.PROJECT,
      payload: project
    };
  }

  static getChildrenSortItems(): SortItem[] {
    return [
      {
        label: 'Названию',
        value: 'name'
      },
      {
        label: 'Дате создания',
        value: 'createdAt'
      }
    ];
  }

  static getChildrenSortDefaultValue(): string {
    return 'createdAt';
  }

  static getChildrenSortDefaultOrder(): SortOrder {
    return SortOrder.DESC;
  }

  static getChildrenFilterField(): string {
    return 'name';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }

  static getRefreshEmitters(): Emitter<DataChangeEventDetail<CrgProject>>[] {
    return [communicationService.projectUpdated];
  }

  static getToolbarActions(item: ExplorerItemData, store: ExplorerStore): ReactNode {
    const handleCreate = (record: CrgProject) => {
      store.selectItem({ payload: record, type: ExplorerItemType.PROJECT });
    };

    const parentId = Number((item.payload as CrgProject)?.id) || undefined;

    return organizationSettings.createProject ? (
      <>
        <CreateProject currentProjectFolderId={parentId} onCreate={handleCreate} />
        <CreateProject currentProjectFolderId={parentId} isFolder onCreate={handleCreate} />
      </>
    ) : null;
  }
}
