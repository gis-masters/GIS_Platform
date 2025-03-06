import React, { useEffect, useMemo } from 'react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { HomeOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { AxiosError } from 'axios';

import { Schema } from '../../services/data/schema/schema.models';
import { schemaService } from '../../services/data/schema/schema.service';
import { applyContentType } from '../../services/data/schema/schema.utils';
import { Task } from '../../services/data/task/task.models';
import { services } from '../../services/services';
import { formatDate } from '../../services/util/date.util';
import { Breadcrumbs, BreadcrumbsItemData } from '../Breadcrumbs/Breadcrumbs';
import { Toast } from '../Toast/Toast';
import { ViewContentWidget } from '../ViewContentWidget/ViewContentWidget';

import '!style-loader!css-loader!sass-loader!./TaskCard.scss';

const cnTaskCard = cn('TaskCard');

export interface TaskCardProps extends IClassNameProps {
  task: Task;
}

export default observer(({ task, className }: TaskCardProps) => {
  const [primalSchema, setPrimalSchema] = React.useState<Schema>();
  const [breadcrumbsItems, setBreadcrumbsItems] = React.useState<BreadcrumbsItemData[]>([]);

  const schema = useMemo(() => {
    if (task && primalSchema) {
      return applyContentType(primalSchema, task.content_type_id);
    }
  }, [task, primalSchema]);

  const getTaskBreadcrumbs = (task: Task): BreadcrumbsItemData[] => {
    return [
      { title: <HomeOutlined />, url: '/data-management' },
      {
        title: 'Задачи',
        url: '/data-management/tasks-journal'
      },
      {
        title: <b>Задача №{task.id}</b>,
        url: `/data-management/tasks-journal/${task.id}`
      }
    ];
  };

  useEffect(() => {
    if (task) {
      setBreadcrumbsItems(getTaskBreadcrumbs(task));
    }
  }, [task]);

  useEffect(() => {
    async function fetchSchema(): Promise<void> {
      try {
        const schema = await schemaService.getSchema('tasks_schema_v1');

        runInAction(() => {
          setPrimalSchema(schema);
        });
      } catch (error) {
        const err = error as AxiosError;
        Toast.warn(`Ошибка получения схемы. ${err.message}`);
        services.logger.warn(`Ошибка получения схемы. ${err.message}`);
      }
    }

    void fetchSchema();
  }, []);

  return (
    <div className={cnTaskCard(null, [className])}>
      <Breadcrumbs className={cnTaskCard('Breadcrumbs')} itemsType='link' items={breadcrumbsItems} />

      <div className={cnTaskCard('Card')}>
        {schema && <ViewContentWidget formRole='viewDocument' schema={schema} data={task} title='Карточка задачи' />}
      </div>

      <div className={cnTaskCard('Date')}>
        <span className={cnTaskCard('DateTitle')}>Дата создания: </span>
        {task.created_at && formatDate(task.created_at, 'LL')}
      </div>
    </div>
  );
});
