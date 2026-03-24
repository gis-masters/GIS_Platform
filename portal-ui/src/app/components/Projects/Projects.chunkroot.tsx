import React, { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { debounce, type DebouncedFunc } from 'lodash';

import { communicationService, type DataChangeEventDetail } from '../../services/communication.service';
import { type CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { currentProjectFolderStore, FOLDER_PARAM } from '../../stores/CurrentProjectFolder.store';
import { route } from '../../stores/Route.store';
import { Loading } from '../Loading/Loading';
import { Toast } from '../Toast/Toast';
import { ProjectsContent } from './Content/ProjectsContent';
import { ProjectsEmpty } from './Empty/ProjectsEmpty';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';
import { ProjectsLoader } from './Loader/Projects-Loader';
import { ProjectsStore } from './Projects.store';

import './Projects.scss';
import './Add/Projects-Add.scss';

const cnProjects = cn('Projects');

const Projects: FC = observer(() => {
  const store = useMemo(() => new ProjectsStore(), []);
  const { busy, setBusy, setProjects, displayedList } = store;

  const debouncedFetchProjectsRef = useRef<DebouncedFunc<() => Promise<void>>>();

  const folderId = route.queryParams[FOLDER_PARAM];

  // Загрузка корневых проектов
  const loadRootProjects = useCallback(async () => {
    try {
      setBusy(true);

      currentProjectFolderStore.setCurrentFolder(null);

      const projects = await projectsService.getAllProjects();
      setProjects(projects ?? []);
    } catch {
      setProjects([]);
    } finally {
      setBusy(false);
    }
  }, [setBusy, setProjects]);

  // Загрузка проектов для текущей папки
  const loadFolderProjects = useCallback(
    async (id: number) => {
      try {
        setBusy(true);

        const folder = await projectsService.getById(id);
        currentProjectFolderStore.setCurrentFolder(folder);

        const projects = await projectsService.getAllProjectsInFolder(id);
        setProjects(projects ?? []);
      } catch {
        currentProjectFolderStore.setCurrentFolder(null);
        await loadRootProjects();

        Toast.error(`Не удалось загрузить папку ${id}`);
      } finally {
        setBusy(false);
      }
    },
    [loadRootProjects, setBusy, setProjects]
  );

  useEffect(() => {
    if (folderId) {
      void loadFolderProjects(Number(folderId));
    } else {
      void loadRootProjects();
    }
  }, [folderId, loadFolderProjects, loadRootProjects]);

  // Обработчик события обновления проекта
  const handleProjectUpdated = useCallback(
    (e: CustomEvent<DataChangeEventDetail<CrgProject>>) => {
      const { type, data } = e.detail;

      // Немедленно обновляем стор на основе данных из события
      switch (type) {
        case 'create': {
          store.addProject(data);
          break;
        }
        case 'update': {
          store.updateProject(data.id, data);
          break;
        }
        case 'delete': {
          store.deleteProject(data.id);
          break;
        }
      }

      void debouncedFetchProjectsRef.current?.();
    },
    [store]
  );

  useEffect(() => {
    const refresh = async () => {
      await (folderId ? loadFolderProjects(Number(folderId)) : loadRootProjects());
    };

    debouncedFetchProjectsRef.current = debounce(refresh, 300);

    communicationService.projectUpdated.on(handleProjectUpdated);

    return () => {
      debouncedFetchProjectsRef.current?.cancel();
      communicationService.off(handleProjectUpdated);
    };
  }, [handleProjectUpdated, folderId, loadFolderProjects, loadRootProjects]);

  const hasProjects = displayedList.length > 0;

  return (
    <div className={cnProjects(null, ['scroll'])}>
      {store.inited ? (
        <>
          <ProjectsHeader store={store} />

          {hasProjects ? (
            <ProjectsList>
              <ProjectsContent projects={displayedList} store={store} />
            </ProjectsList>
          ) : (
            <ProjectsEmpty />
          )}

          <Loading visible={busy} />
        </>
      ) : (
        <ProjectsLoader />
      )}
    </div>
  );
});

export default Projects;
