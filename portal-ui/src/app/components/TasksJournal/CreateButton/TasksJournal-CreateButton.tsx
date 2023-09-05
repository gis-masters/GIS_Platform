import React, { FC, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import { ContentType, Schema } from '../../../services/data/schema/schema.models';
import { MenuIconButton } from '../../MenuIconButton/MenuIconButton';
import { TasksJournalCreate } from '../Create/TasksJournal-Create';

const cnTasksJournalCreateButton = cn('TasksJournal', 'CreateButton');

interface TasksJournalCreateButtonProps {
  icon: ReactNode;
  schema: Schema;
  contentTypes: ContentType[];
}

export const TasksJournalCreateButton: FC<TasksJournalCreateButtonProps> = ({ icon, contentTypes, schema }) => (
  <MenuIconButton className={cnTasksJournalCreateButton()} icon={icon} keepMounted>
    {contentTypes.map(
      (contentType, i) =>
        !contentType.childOnly && <TasksJournalCreate contentType={contentType} schema={schema} key={i} />
    )}
  </MenuIconButton>
);
