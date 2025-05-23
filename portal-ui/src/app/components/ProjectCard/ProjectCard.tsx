import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../services/gis/projects/projects.models';
import { ProjectCardCard } from './Card/ProjectCard-Card';
import { ProjectCardInner } from './Inner/ProjectCard-Inner';

import '!style-loader!css-loader!sass-loader!./ProjectCard.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardProps {
  project: CrgProject;
  className?: string;
}

export const ProjectCard: FC<ProjectCardProps> = ({ className, project }) => (
  <div className={cnProjectCard(null, [className])} data-id={project.id}>
    <ProjectCardInner>
      <ProjectCardCard project={project} />
    </ProjectCardInner>
  </div>
);
