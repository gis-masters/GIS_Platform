import React, { FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../services/gis/projects/projects.models';

import { ProjectCardCard } from './Card/ProjectCard-Card';
import { ProjectCardInner } from './Inner/ProjectCard-Inner';
import { ProjectCardDelete } from './Delete/ProjectCard-Delete';

import '!style-loader!css-loader!sass-loader!./ProjectCard.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardProps {
  project?: CrgProject;
  className?: string;
  cardRef: RefObject<HTMLDivElement>;
}

export const ProjectCard: FC<ProjectCardProps> = ({ className, project, cardRef }) => (
  <div className={cnProjectCard(null, [className])} ref={cardRef} data-id={project.id}>
    <ProjectCardInner>
      <ProjectCardCard project={project} />
      <ProjectCardDelete project={project} />
    </ProjectCardInner>
  </div>
);
