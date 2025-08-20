import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { ProjectCard } from '../../ProjectCard/ProjectCard';
import { ProjectFolder } from '../../ProjectFolder/ProjectFolder';

import '!style-loader!css-loader!sass-loader!./ProjectsContent.scss';

const cnProjectsContent = cn('ProjectsContent');
export interface ProjectsContentProps {
  projects: CrgProject[];
}

export const ProjectsContent: FC<ProjectsContentProps> = React.memo(({ projects }) => {
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.folder === true && b.folder !== true) {
      return -1;
    }
    if (a.folder !== true && b.folder === true) {
      return 1;
    }

    return 0;
  });

  if (sortedProjects.length === 0) {
    return <div className={cnProjectsContent('Empty')}>Пусто</div>;
  }

  return (
    <>
      {sortedProjects.map(project =>
        project.folder ? (
          <ProjectFolder className={cnProjectsContent('Card')} project={project} key={project.id} />
        ) : (
          <ProjectCard className={cnProjectsContent('Card')} project={project} key={project.id} />
        )
      )}
    </>
  );
});
