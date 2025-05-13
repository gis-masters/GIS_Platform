import React, { FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../services/gis/projects/projects.models';
import { ProjectFolderCard } from './Card/ProjectFolder-Card';
import { ProjectFolderDelete } from './Delete/ProjectFolder-Delete';
import { ProjectFolderInner } from './Inner/ProjectFolder-Inner';

import '!style-loader!css-loader!sass-loader!./ProjectFolder.scss';

const cnProjectFolder = cn('ProjectFolder');

interface ProjectFolderProps {
  project: CrgProject;
  className?: string;
  cardRef?: RefObject<HTMLDivElement>;
  setOpenedFolder?: (id: number) => void;
}

export const ProjectFolder: FC<ProjectFolderProps> = ({ className, project, setOpenedFolder, cardRef }) => (
  <div className={cnProjectFolder(null, [className])} ref={cardRef} data-id={project.id}>
    <ProjectFolderInner>
      <ProjectFolderCard setOpenedFolder={setOpenedFolder} project={project} />
      <ProjectFolderDelete project={project} />
    </ProjectFolderInner>
  </div>
);
