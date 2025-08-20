import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { communicationService } from '../../../services/communication.service';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { ActionTypes, DataTypes } from '../../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../../services/permissions/permissions.utils';
import { achtung, konfirmieren } from '../../../services/utility-dialogs.service';
import { ActionsItemVariant } from '../../Actions/Item/Actions-Item.base';
import { ActionsItem } from '../../Actions/Item/Actions-Item.composed';

const cnProjectActionsDelete = cn('ProjectActions', 'Delete');

interface ProjectActionsDeleteProps {
  project: CrgProject;
  as: ActionsItemVariant;
  disabled?: boolean;
  tooltipText?: string;
}

export const ProjectActionsDelete = observer((props: ProjectActionsDeleteProps) => {
  const { disabled, project, tooltipText, as } = props;
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const role = project.role;

  if (!role) {
    return null;
  }

  const handleDelete = useCallback(async () => {
    setDialogOpen(true);
    const confirmed = await konfirmieren({
      title: 'Подтверждение удаления',
      message: `Вы действительно хотите удалить "${project.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await projectsService.delete(project.id);
      communicationService.projectUpdated.emit({ type: 'delete', data: project });
    }

    setDialogOpen(false);
  }, [project]);

  const testEmptiness = useCallback(async () => {
    const [projects] = await projectsService.getProjects({
      page: 0,
      pageSize: 1,
      filter: {
        parent: project.id
      }
    });

    if (projects.length) {
      await achtung({
        title: 'Невозможно удалить',
        message: 'Папка проектов не пуста. Для её удаления необходимо сперва удалить все проекты внутри.'
      });

      return;
    }

    await handleDelete();
  }, [handleDelete, project.id]);

  return (
    <ActionsItem
      title={disabled && tooltipText ? tooltipText : 'Удалить'}
      tooltipText={disabled ? getAvailableActionsTooltipByRole(ActionTypes.DELETE, role, DataTypes.PROJECT) : undefined}
      className={cnProjectActionsDelete()}
      icon={dialogOpen ? <Delete /> : <DeleteOutline />}
      onClick={project.folder ? testEmptiness : handleDelete}
      color='error'
      as={as}
      disabled={disabled}
    />
  );
});
