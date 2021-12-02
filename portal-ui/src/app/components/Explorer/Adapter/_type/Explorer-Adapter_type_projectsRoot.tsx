import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { communicationService } from '../../../../services/communication.service';
import { staticImplements } from '../../../../services/util/staticImplements';
import { projectsService } from '../../../../services/crg/projects.service';
import { CrgProject } from '../../../../services/crg/projects.models';
import { PageOptions, SortDir } from '../../../../services/models';
import { Emitter } from '../../../../services/common/Emitter';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { ExplorerUrlItem } from '../../Explorer';

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
    { page, pageSize, sort, sortDir, filter }: PageOptions
  ): Promise<[ExplorerItemData<CrgProject>[], number]> {
    const [projects, pagesCount] = await projectsService.getProjects(page, pageSize, sort, sortDir, filter);

    return [projects.map(payload => ({ type: ExplorerItemType.PROJECT, payload })), pagesCount];
  }

  static async getChildrenWithParticularOne(
    item: ExplorerItemData,
    options: PageOptions,
    [, id, page]: ExplorerUrlItem
  ): Promise<[ExplorerItemData<CrgProject>[], number, number]> | undefined {
    const response = await projectsService.getProjectsWithParticularOne(id, {
      ...options,
      page
    });

    if (!response) {
      return;
    }

    const [libraries, totalPages, pageNumber] = response;

    return [libraries.map(payload => ({ type: ExplorerItemType.PROJECT, payload })), totalPages, pageNumber];
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

  static getChildrenSortDefaultDirection(): SortDir {
    return SortDir.DESC;
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
