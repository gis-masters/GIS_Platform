import React, { ReactNode } from 'react';
import { Tooltip } from '@mui/material';
import { ArticleOutlined, ViewListOutlined } from '@mui/icons-material';

import { services } from '../../../../services/services';
import { staticImplements } from '../../../../services/util/staticImplements';
import { Adapter } from '../../Explorer.models';

@staticImplements<Adapter>()
export class ExplorerAdapterTypeTasksRoot {
  static getId(): string {
    return 'tasksRoot';
  }

  static getTitle(): string {
    return 'Задачи';
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

  static customOpenActionIcon(): ReactNode {
    return (
      <Tooltip title='Перейти в журнал задач'>
        <span>
          <ViewListOutlined />
        </span>
      </Tooltip>
    );
  }

  static async customOpenAction(): Promise<void> {
    await services.provided;

    services.ngZone.run(() => {
      setTimeout(() => {
        void services.router.navigateByUrl('/data-management/tasks-journal');
      }, 0);
    });
  }
}
