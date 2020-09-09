import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Project } from '../../services/crg/projects.models';

import { ProjectCardAdd } from './Add/ProjectCard-Add';
import { ProjectCardCard } from './Card/ProjectCard-Card';
import { ProjectCardInner } from './Inner/ProjectCard-Inner';
import { ProjectCardDelete } from './Delete/ProjectCard-Delete';

import '!style-loader!css-loader!sass-loader!./ProjectCard.scss';

const cnProjectCard = cn('ProjectCard');

export type CardTyp = 'card' | 'add';

interface ProjectCardProps {
  project?: Project;
  className?: string;
  typ: CardTyp;
}

export const ProjectCard: FC<ProjectCardProps> = ({ className, project, typ }) => (
  <div className={cnProjectCard(null, [className])}>
    <ProjectCardInner typ={typ}>
      {typ === 'add' ? (
        <ProjectCardAdd />
      ) : (
        <>
          <ProjectCardCard project={project} />
          <ProjectCardDelete project={project} />
        </>
      )}
    </ProjectCardInner>
  </div>
);
