import React, { type FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { debounce, type DebouncedFunc } from 'lodash';

import { communicationService, type DataChangeEventDetail } from '../../services/communication.service';
import { type CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { services } from '../../services/services';
import { currentProjectFolderStore, FOLDER_PARAM } from '../../stores/CurrentProjectFolder.store';
import { Loading } from '../Loading/Loading';
import { ProjectsContent } from './Content/ProjectsContent';
import { ProjectsEmpty } from './Empty/ProjectsEmpty';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';
import { ProjectsLoader } from './Loader/Projects-Loader';
import { ProjectsStore } from './Projects.store';

import './Projects.scss';
import './Add/Projects-Add.scss';

const cnProjects = cn('Projects');

interface ProjectsState {
  lastFolderId: string | null;
}

const Projects: FC = observer(() => {
  const store = useMemo(() => new ProjectsStore(), []);
  const { busy, setBusy, setProjects, displayedList } = store;

  const debouncedFetchProjectsRef = useRef<DebouncedFunc<() => Promise<void>>>();

  // Загрузка корневых проектов
  const loadRootProjects = useCallback(async () => {
    try {
      setBusy(true);
      const projects = await projectsService.getAllProjects();
      setProjects(projects);

      const url = new URL(window.location.href);
      url.searchParams.delete(FOLDER_PARAM);

      currentProjectFolderStore.setCurrentFolder(null);
    } catch (error) {
      console.error('Error loading root projects:', error);
      setProjects([]);
    } finally {
      setBusy(false);
    }
  }, [setBusy, setProjects]);

  // Загрузка проектов для текущей папки
  const loadFolderProjects = useCallback(
    async (projectId: number) => {
      try {
        setBusy(true);
        const projectFolder = await projectsService.getById(projectId);

        if (!projectFolder?.folder) {
          services.logger.error('Выбранная папка не найдена');

          return;
        }

        currentProjectFolderStore.setCurrentFolder(projectFolder);
        const projects = await projectsService.getAllProjectsInFolder(projectId);
        setProjects(projects || []);
      } catch (error) {
        console.error('Error loading folder projects:', error);
        currentProjectFolderStore.setCurrentFolder(null);
        await loadRootProjects();
      } finally {
        setBusy(false);
      }
    },
    [loadRootProjects, setBusy, setProjects]
  );

  // Обновление списка проектов
  const fetchProjects = useCallback(async () => {
    const url = new URL(window.location.href);
    const currentFolderId = url.searchParams.get(FOLDER_PARAM);

    await (currentFolderId ? loadFolderProjects(Number(currentFolderId)) : loadRootProjects());
  }, [loadFolderProjects, loadRootProjects]);

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

      // Инициируем обновление списка через API с debounce
      void debouncedFetchProjectsRef.current?.();
    },
    [store]
  );

  // Обработка изменений URL
  const handleUrlChange = useCallback(
    async (state: ProjectsState) => {
      const url = new URL(window.location.href);
      const currentFolderId = url.searchParams.get(FOLDER_PARAM);

      if (currentFolderId === state.lastFolderId) {
        return state;
      }

      state.lastFolderId = currentFolderId;

      await (currentFolderId ? loadFolderProjects(Number(currentFolderId)) : loadRootProjects());

      return state;
    },
    [loadFolderProjects, loadRootProjects]
  );

  useEffect(() => {
    // Создаём debounced функцию для обновления списка
    debouncedFetchProjectsRef.current = debounce(fetchProjects, 300);

    // Подписываемся на событие обновления проектов
    communicationService.projectUpdated.on(handleProjectUpdated);

    return () => {
      debouncedFetchProjectsRef.current?.cancel();
      communicationService.off(handleProjectUpdated);
    };
  }, [fetchProjects, handleProjectUpdated]);

  useEffect(() => {
    const state: ProjectsState = { lastFolderId: null };

    // Инициализация: проверяем сохраненную папку
    const initializeProjects = async () => {
      setBusy(true);
      const savedFolderId = currentProjectFolderStore.getSavedFolderId();

      await (savedFolderId ? loadFolderProjects(savedFolderId) : loadRootProjects());
      setBusy(false);
    };

    void initializeProjects();

    // Наблюдаем за изменениями URL
    const observer = new MutationObserver(() => {
      void handleUrlChange(state);
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true
    });

    // Проверяем URL при первой загрузке
    void handleUrlChange(state);

    return () => observer.disconnect();
  }, [handleUrlChange, loadFolderProjects, loadRootProjects, setBusy]);

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
