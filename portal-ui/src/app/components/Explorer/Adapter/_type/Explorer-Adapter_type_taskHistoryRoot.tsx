import React, { ReactNode } from 'react';
import { ArticleOutlined } from '@mui/icons-material';

import { Adapter, ExplorerItemData, ExplorerItemType } from '../../Explorer.models';
import { Task, TaskHistory } from '../../../../services/data/task/task.models';
import { staticImplements } from '../../../../services/util/staticImplements';
import { getTaskHistory } from '../../../../services/data/task/task.service';
import { PageOptions } from '../../../../services/models';

@staticImplements<Adapter<Task>>()
export class ExplorerAdapterTypeTaskHistoryRoot {
  static getId(): string {
    return 'taskHistory';
  }

  static getTitle(): string {
    return 'История задачи';
  }

  static getDescription(): string {
    return 'Доступно только администратору организации';
  }

  static getMeta(): string {
    return '';
  }

  static getIcon(): ReactNode {
    return <ArticleOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return true;
  }

  static async getChildren(
    item: ExplorerItemData<Task>,
    pageOptions: PageOptions
  ): Promise<[ExplorerItemData<TaskHistory>[], number]> {
    const tasks = await getTaskHistory(item.payload.id);

    const pagesCount = Math.ceil(tasks.length / pageOptions.pageSize);
    const pageStart =
      tasks.length > pageOptions.page * pageOptions.pageSize ? pageOptions.page * pageOptions.pageSize : 0;
    const pageEnd = pageStart + pageOptions.pageSize;

    return [
      tasks.slice(pageStart, pageEnd).map(item => ({ type: ExplorerItemType.TASK_HISTORY, payload: item })),
      pagesCount
    ];
  }
}
