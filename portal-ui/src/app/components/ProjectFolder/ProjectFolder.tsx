import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type CrgProject } from '../../services/gis/projects/projects.models';
import { ProjectFolderCard } from './Card/ProjectFolder-Card';
import { ProjectFolderInner } from './Inner/ProjectFolder-Inner';

import './ProjectFolder.scss';

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
