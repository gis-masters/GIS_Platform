import { SortDir } from '../../../../services/models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { projectsService } from '../../../../services/crg/projects.service';
import { CrgProject } from '../../../../services/crg/projects.models';

import { ExplorerItemData, ExplorerItemType, SortItem } from '../../Explorer.models';
import { Adapter } from '../Explorer-Adapter';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.PROJECTS_ROOT]: null;
  }
}

@staticImplements<Adapter>()
export class ExplorerAdapterTypeProjectsRoot {
  static getId(item: ExplorerItemData<CrgProject>) {
    return 'dataSetRoot';
  }

  static getTitle(item: ExplorerItemData<CrgProject>) {
    return 'Проекты';
  }

  static getMeta(item: ExplorerItemData<CrgProject>) {
    return '';
  }

  static isFolder() {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData,
    page: number,
    pageSize: number,
    sort?: string,
    sortDir?: SortDir,
    filter?: { [key: string]: string }
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
