import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { Role } from '../../services/data/permissions/permissions.models';
import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { ProjectActionsDelete } from './Delete/ProjectActions-Delete';
import { ProjectActionsEdit } from './Edit/ProjectActions-Edit';

const cnProjectsActions = cn('ProjectsActions');

interface ProjectsActionsProps {
  project: CrgProject;
}

export const crgProjectSchema: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Название',
      propertyType: PropertyType.STRING
    },
    {
      name: 'description',
      title: 'Описание',
      propertyType: PropertyType.STRING
    },
    {
      name: 'bbox',
      title: 'Bbox',
      propertyType: PropertyType.STRING
    }
  ]
};

export const ProjectsActions: FC<ProjectsActionsProps> = observer(({ project }) => (
  <div className={cnProjectsActions()}>
    {(currentUser.isAdmin || project.role === Role.OWNER) && (
      <>
        <ProjectActionsEdit project={project} schema={crgProjectSchema} />
        <ProjectActionsDelete project={project} />
      </>
    )}
  </div>
));
