import React, { ReactNode } from 'react';
import { MapOutlined } from '@mui/icons-material';

import { PageOptions, SortDir } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { projectsService } from '../../../../services/crg/projects.service';
import { CrgProject } from '../../../../services/crg/projects.models';

import { Adapter, ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.PROJECTS_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProjectsRoot {
  static getId(): string {
    return 'datasetRoot';
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
    return 'Поиск по названию';
  }
}
