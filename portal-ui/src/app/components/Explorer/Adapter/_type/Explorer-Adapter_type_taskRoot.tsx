import React, { ReactNode } from 'react';
import { ArticleOutlined, ViewListOutlined } from '@mui/icons-material';

import { staticImplements } from '../../../../services/util/staticImplements';
import { services } from '../../../../services/services';
import { Adapter } from '../../Explorer.models';

import { Tooltip } from '@mui/material';

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
        <ViewListOutlined />
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
