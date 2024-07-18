import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { PropertyType, SimpleSchema } from '../../services/data/schema/schema.models';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { Role } from '../../services/permissions/permissions.models';
import { currentUser } from '../../stores/CurrentUser.store';
import { ProjectActionsDelete } from './Delete/ProjectActions-Delete';
import { ProjectActionsEdit } from './Edit/ProjectActions-Edit';

const cnProjectActions = cn('ProjectActions');

interface ProjectActionsProps {
  project: CrgProject;
}

export const crgProjectSchema: SimpleSchema = {
  properties: [
    {
      name: 'name',
      title: 'Название',
      required: true,
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
      description: (
        <>
          BBox (bounding box) для картографического слоя в метрах — это прямоугольная область, которая определяет
          границы проекта на карте. Она указывается в метрах и содержит координаты минимального и максимального значений
          по осям X и Y.
          <br />
          Пример заполнения:
          <br />
          [4336548,5630738,4337222,5632892]
        </>
      ),
      propertyType: PropertyType.STRING
    }
  ]
};

export const ProjectActions: FC<ProjectActionsProps> = observer(({ project }) => (
  <div className={cnProjectActions()}>
    {(currentUser.isAdmin || project.role === Role.OWNER) && (
      <>
        <ProjectActionsEdit project={project} schema={crgProjectSchema} />
        <ProjectActionsDelete project={project} />
      </>
    )}
  </div>
));
