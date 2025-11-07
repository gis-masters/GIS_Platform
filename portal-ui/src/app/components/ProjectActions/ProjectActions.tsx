import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type CrgProject, crgProjectFolderSchema, crgProjectSchema } from '../../services/gis/projects/projects.models';
import { ActionTypes, DataTypes, Role } from '../../services/permissions/permissions.models';
import { getAvailableActionsTooltipByRole } from '../../services/permissions/permissions.utils';
import { currentUser } from '../../stores/CurrentUser.store';
import { Actions } from '../Actions/Actions.composed';
import { type ActionsItemVariant } from '../Actions/Item/Actions-Item.base';
import { ProjectActionsDelete } from './Delete/ProjectActions-Delete';
import { ProjectActionsEdit } from './Edit/ProjectActions-Edit';
import { ProjectActionsMove } from './Move/ProjectActions-Move';
import { ProjectActionsShare } from './Share/ProjectActions-Share';

const cnProjectActions = cn('ProjectActions');

interface ProjectActionsProps extends IClassNameProps {
  project: CrgProject;
  as: ActionsItemVariant;
  forDialog?: boolean;
}

export const ProjectActions: FC<ProjectActionsProps> = observer(({ project, className, forDialog, as }) => {
  const owningAllowed = currentUser.isAdmin || project.role === Role.OWNER;
  const { folder } = project;

  return (
    <Actions className={cnProjectActions({ forDialog }, [className])} as={as}>
      <ProjectActionsEdit
        project={project}
        schema={folder ? crgProjectFolderSchema : crgProjectSchema}
        disabled={!owningAllowed}
        tooltipText={getAvailableActionsTooltipByRole(ActionTypes.EDIT, project.role, DataTypes.PROJECT)}
        as={as}
      />
      <ProjectActionsMove
        project={project}
        disabled={!owningAllowed}
        schema={folder ? crgProjectFolderSchema : crgProjectSchema}
        as={as}
        tooltipText={getAvailableActionsTooltipByRole(ActionTypes.DELETE, project.role, DataTypes.PROJECT)}
      />
      <ProjectActionsShare project={project} as={as} />
      <ProjectActionsDelete
        project={project}
        disabled={!owningAllowed}
        tooltipText={getAvailableActionsTooltipByRole(ActionTypes.DELETE, project.role, DataTypes.PROJECT)}
        as={as}
      />
    </Actions>
  );
});
