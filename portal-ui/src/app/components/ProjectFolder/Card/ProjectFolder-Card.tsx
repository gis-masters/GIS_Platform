import React, { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { allProjects } from '../../../stores/AllProjects.store';
import { currentProjectFolderStore } from '../../../stores/CurrentProjectFolder.store';
import { Button } from '../../Button/Button';
import { Toast } from '../../Toast/Toast';
import { ProjectFolderName } from '../Name/ProjectFolder-Name';

import '!style-loader!css-loader!sass-loader!./ProjectFolder-Card.scss';

const cnProjectFolderCard = cn('ProjectFolder', 'Card');

interface ProjectFolderCardProps {
  project: CrgProject;
}

export const ProjectFolderCard: FC<ProjectFolderCardProps> = observer(({ project }) => {
  const openFolder = useCallback(async () => {
    try {
      const folder = allProjects.list.find(item => item.id === project.id && project.folder);

      if (folder) {
        currentProjectFolderStore.setCurrentFolder(folder);
      }

      const projects = await projectsService.getAllProjectsInFolder(project.id);
      allProjects.setList(projects);
    } catch (error) {
      Toast.error((error as AxiosError).message || 'Не удалось загрузить проекты из папки');
    }
  }, [project]);

  return (
    <Button className={cnProjectFolderCard()} onClick={openFolder}>
      <ProjectFolderName>{project.name}</ProjectFolderName>
    </Button>
  );
});
