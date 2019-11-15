import * as React from 'react';
import { cn } from '@bem-react/classname';

import { Project } from '../../stores/ProjectsList.store';
import { ProcessStatus } from '../../services/crg/models';

import { ProjectCardAdd } from './Add/ProjectCard-Add';
import { ProjectCardCard } from './Card/ProjectCard-Card';
import { ProjectCardLoader } from './Loader/ProjectCard-Loader';

import '!style-loader!css-loader!sass-loader!./ProjectCard.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardProps {
  project?: Project;
  className?: string;
  typ: 'card' | 'loader' | 'add';
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ className, project, typ }) => {
  if (project && project.status === ProcessStatus.PENDING) {
    typ = 'loader';
  }

  return (
    <div className={cnProjectCard(null, [className])}>
      <div className={cnProjectCard('Inner', { typ })}>
        {typ === 'add' ? <ProjectCardAdd /> : (
            typ === 'loader' ?
                <ProjectCardLoader /> :
                <ProjectCardCard project={project} />
        )}
      </div>
    </div>
  );
};
