import React, { ReactNode } from 'react';
import { ArticleOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { TaskHistory } from '../../../../services/data/task/task.models';
import { Adapter, ExplorerItemData } from '../../Explorer.models';
import { formatDate } from '../../../../services/util/date.util';

declare module '../../Explorer.models' {
  export interface ExplorerItemPayloads {
    [ExplorerItemType.TASK_HISTORY]: TaskHistory;
  }
}

@staticImplements<Adapter<TaskHistory>>()
export class ExplorerAdapterTypeTaskHistory {
  static getId(item: ExplorerItemData<TaskHistory>): string {
    return String(item.payload.id);
  }

  static getTitle(item: ExplorerItemData<TaskHistory>): string {
    return formatDate(String(item.payload.massage.last_modified || item.payload.createdAt), 'HH:mm DD.MM.YYYY');
  }

  static getDetails(): string {
    return '';
  }

  static getMeta(item: ExplorerItemData<TaskHistory>): string {
    return item.payload.eventType;
  }

  static getIcon(): ReactNode {
    return <ArticleOutlined color='primary' />;
  }

  static isFolder(): boolean {
    return false;
  }
}
