import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { communicationService } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { projectsService } from '../../../../services/gis/projects.service';
import { CrgProject } from '../../../../services/gis/projects.models';
import { PageOptions, SortOrder } from '../../../../services/models';
import { Emitter } from '../../../../services/common/Emitter';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerStore } from '../../Explorer.store';
import { ExplorerService } from '../../Explorer.service';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.PROJECTS_ROOT]: null;
  }
}

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
  ): Promise<[ExplorerItemData<CrgProject>[], number]> {
    const [projects, pagesCount] = await projectsService.getProjects({
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    return [projects.map(payload => ({ type: ExplorerItemType.PROJECT, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    { filter, ...options }: PageOptions,
    id: string,
    store: ExplorerStore,
    service: ExplorerService
  ): Promise<[ExplorerItemData<CrgProject>[], number, number]> | undefined {
    const response = await projectsService.getProjectsWithParticularOne(id, {
      ...options,
      filter: service.mergeCustomFilter(filter, item, store)
    });

    if (!response) {
      return;
    }

    const [libraries, totalPages, pageNumber] = response;

    return [libraries.map(payload => ({ type: ExplorerItemType.PROJECT, payload })), totalPages, pageNumber];
  }

  static async getChildById(item: ExplorerItemData, id: string): Promise<ExplorerItemData<CrgProject>> {
    const project = await projectsService.getById(Number(id));

    return {
      type: ExplorerItemType.PROJECT,
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

  static getRefreshEmitters(): Emitter[] {
    return [communicationService.projectsUpdated, communicationService.projectCreated as Emitter];
  }
}
