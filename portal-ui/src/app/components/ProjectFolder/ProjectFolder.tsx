import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../services/gis/projects/projects.models';
import { ProjectFolderCard } from './Card/ProjectFolder-Card';
import { ProjectFolderInner } from './Inner/ProjectFolder-Inner';

import '!style-loader!css-loader!sass-loader!./ProjectFolder.scss';

const cnProjectFolder = cn('ProjectFolder');

interface ProjectFolderProps {
  project: CrgProject;
  className?: string;
}

export const ProjectFolder: FC<ProjectFolderProps> = ({ className, project }) => (
  <div className={cnProjectFolder(null, [className])} data-id={project.id}>
    <ProjectFolderInner>
      <ProjectFolderCard project={project} />
    </ProjectFolderInner>
  </div>
);
