import React, { ReactNode } from 'react';
import { FolderOutlined } from '@mui/icons-material';

import { CrgProject } from '../../../../services/gis/projects/projects.models';
import { projectsService } from '../../../../services/gis/projects/projects.service';
import { PageOptions, SortOrder } from '../../../../services/models';
import { services } from '../../../../services/services';
import { formatDate } from '../../../../services/util/date.util';
import { staticImplements } from '../../../../services/util/staticImplements';
import { organizationSettings } from '../../../../stores/OrganizationSettings.store';
import { CreateProject } from '../../../CreateProject/CreateProject';
import { ProjectActions } from '../../../ProjectActions/ProjectActions';
import {
  Adapter,
  ExplorerItemData,
  ExplorerItemDataAllTypes,
  ExplorerItemType,
  itemTypeError,
  SortItem
} from '../../Explorer.models';
import { ExplorerService } from '../../Explorer.service';
import { ExplorerStore } from '../../Explorer.store';

export function assertExplorerItemDataTypeProjectFolder(
  item: ExplorerItemData
): asserts item is ExplorerItemDataAllTypes[ExplorerItemType.PROJECT_FOLDER] {
  if (item.type !== ExplorerItemType.PROJECT_FOLDER) {
    throw itemTypeError;
  }
}

type NewType = SortOrder;

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProjectFolder {
  static getId(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProjectFolder(item);

    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProjectFolder(item);

    return item.payload.name;
  }

  static getMeta(item: ExplorerItemData): string {
    assertExplorerItemDataTypeProjectFolder(item);

    const { createdAt, id } = item.payload;
    const date = createdAt ? `${formatDate(createdAt, 'LL')}` : '';

    return `${date} (id: ${id})`;
  }

  static getIcon(): ReactNode {
    return <FolderOutlined color='primary' />;
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
    assertExplorerItemDataTypeProjectFolder(item);

    const [projects, pagesCount] = await projectsService.getProjects({
      ...options,
      filter: {
        ...service.mergeCustomFilter(filter, item, store),
        parent: item.payload.id
      }
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
    assertExplorerItemDataTypeProjectFolder(item);

    const response = await projectsService.getProjectsWithParticularOne(id, {
      ...options,
      filter: {
        ...service.mergeCustomFilter(filter, item, store),
        parent: item.payload.id
      }
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
    assertExplorerItemDataTypeProjectFolder(item);

    const project = await projectsService.getById(Number(id));

    if (!project) {
      throw new Error(`Проект ${id} не найден`);
    }

    return {
      type: project.folder ? ExplorerItemType.PROJECT_FOLDER : ExplorerItemType.PROJECT,
      payload: project
    };
  }

  static getActions(item: ExplorerItemData): ReactNode {
    assertExplorerItemDataTypeProjectFolder(item);

    return <ProjectActions project={item.payload} as='iconButton' />;
  }

  static async customOpenAction(item: ExplorerItemData): Promise<void> {
    assertExplorerItemDataTypeProjectFolder(item);

    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl(`/projects/${item.payload.id}/map`);
      }, 0);
    });
  }

  static getToolbarActions(item: ExplorerItemData, store: ExplorerStore): ReactNode {
    assertExplorerItemDataTypeProjectFolder(item);

    const handleCreate = (record: CrgProject) => {
      store.selectItem({ payload: record, type: ExplorerItemType.PROJECT });
    };

    return organizationSettings.createProject ? (
      <>
        <CreateProject currentProjectFolderId={item.payload.id} onCreate={handleCreate} />
        <CreateProject currentProjectFolderId={item.payload.id} isFolder onCreate={handleCreate} />
      </>
    ) : null;
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

  static getChildrenSortDefaultOrder(): NewType {
    return SortOrder.DESC;
  }

  static getChildrenFilterField(): string {
    return 'name';
  }

  static getChildrenFilterLabel(): string {
    return 'Фильтр по названию';
  }
}
