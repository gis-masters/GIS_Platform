import * as React from 'react';
import {cn} from '@bem-react/classname';

import {Project} from '../../stores/ProjectsList.store';

import {ProjectCardAdd} from './Add/ProjectCard-Add';
import {ProjectCardCard} from './Card/ProjectCard-Card';

import '!style-loader!css-loader!sass-loader!./ProjectCard.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardProps {
  project?: Project;
  className?: string;
  typ: 'card' | 'add';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({className, project, typ}) => (
  <div className={cnProjectCard(null, [className])}>
    <div className={cnProjectCard('Inner', {typ})}>
      {typ === 'add' ? <ProjectCardAdd/> : (<ProjectCardCard project={project}/>)}
    </div>
  </div>
);
