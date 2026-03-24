import React, { type FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { type AxiosError } from 'axios';

import { type CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { services } from '../../../services/services';
import { currentProjectFolderStore, FOLDER_PARAM } from '../../../stores/CurrentProjectFolder.store';
import { Button } from '../../Button/Button';
import { type ProjectsStore } from '../../Projects/Projects.store';
import { Toast } from '../../Toast/Toast';
import { ProjectFolderName } from '../Name/ProjectFolder-Name';

import './ProjectFolder-Card.scss';

const cnProjectFolderCard = cn('ProjectFolder', 'Card');

interface ProjectFolderCardProps {
  project: CrgProject;
  store: ProjectsStore;
}

export const ProjectFolderCard: FC<ProjectFolderCardProps> = observer(({ project, store }) => {
  const openFolder = useCallback(async () => {
    void services.router.navigate([], {
      queryParams: { [FOLDER_PARAM]: project.id },
      queryParamsHandling: 'merge'
    });

    try {
      const folder = store.projects.find(item => item.id === project.id && project.folder);
      if (folder) {
        currentProjectFolderStore.setCurrentFolder(folder);
      }
      const projects = await projectsService.getAllProjectsInFolder(project.id);
      store.setProjects(projects || []);
    } catch (error) {
      Toast.error((error as AxiosError).message || 'Не удалось загрузить проекты из папки');
    }
  }, [project.id]);

  // TODO: тут должна быть ссылка
  return (
    <Button className={cnProjectFolderCard()} onClick={openFolder}>
      <ProjectFolderName>{project.name}</ProjectFolderName>
    </Button>
  );
});
