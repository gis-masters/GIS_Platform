import React from 'react';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { Role } from '../../../services/permissions/permissions.models';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { currentUser } from '../../../stores/CurrentUser.store';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Delete.scss';

const cnProjectFolderDelete = cn('ProjectFolder', 'Delete');

interface ProjectFolderDeleteProps {
  project: CrgProject;
}

export const ProjectFolderDelete = observer((props: ProjectFolderDeleteProps) => {
  const { project } = props;

  if (!currentUser.isAdmin && project.role !== Role.OWNER) {
    return null;
  }

  const deleteProject = async () => {
    const confirmed = await konfirmieren({
      message: 'Вы действительно хотите удалить проект?',
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await projectsService.delete(project.id);
    }
  };

  return (
    <IconButton className={cnProjectFolderDelete()} onClick={deleteProject}>
      <Delete />
    </IconButton>
  );
});
