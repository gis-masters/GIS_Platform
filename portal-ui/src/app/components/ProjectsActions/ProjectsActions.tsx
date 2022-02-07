import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { CrgProject } from '../../services/crg/projects.models';
import { Role } from '../../services/crg/permissions.models';

import { ProjectActionsDelete } from './Delete/ProjectActions-Delete';

const cnProjectsActions = cn('ProjectsActions');

interface ProjectsActionsProps {
  project: CrgProject;
}

export const ProjectsActions: FC<ProjectsActionsProps> = observer(({ project }) => (
  <div className={cnProjectsActions()}>
    {(currentUser.isAdmin || project.role === Role.OWNER) && <ProjectActionsDelete project={project} />}
  </div>
));
