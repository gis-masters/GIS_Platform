import React, { FC, useCallback, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { projectsService } from '../../services/gis/projects/projects.service';
import { services } from '../../services/services';
import { allProjects } from '../../stores/AllProjects.store';
import { currentProjectFolderStore, FOLDER_PARAM } from '../../stores/CurrentProjectFolder.store';
import { Loading } from '../Loading/Loading';
import { ProjectsContent } from './Content/ProjectsContent';
import { ProjectsEmpty } from './Empty/ProjectsEmpty';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';
import { ProjectsLoader } from './Loader/Projects-Loader';

import '!style-loader!css-loader!sass-loader!./Projects.scss';
import '!style-loader!css-loader!sass-loader!./Add/Projects-Add.scss';

const cnProjects = cn('Projects');

interface ProjectsState {
  lastFolderId: string | null;
}

interface ProjectsStore {
  busy: boolean;
  setBusy(busy: boolean): void;
}

const Projects: FC = observer(() => {
  const { busy, setBusy } = useLocalObservable(
    (): ProjectsStore => ({
      busy: false,
      setBusy(this: ProjectsStore, busy: boolean): void {
        this.busy = busy;
      }
    })
  );

  // Загрузка корневых проектов
  const loadRootProjects = useCallback(async () => {
    try {
      setBusy(true);
      const projects = await projectsService.getAllProjects();
      allProjects.setList(projects);

      const url = new URL(window.location.href);
      url.searchParams.delete(FOLDER_PARAM);

      currentProjectFolderStore.setCurrentFolder(null);
    } catch (error) {
      console.error('Error loading root projects:', error);
      allProjects.setList([]);
    } finally {
      setBusy(false);
    }
  }, [setBusy]);

  // Загрузка проектов для папки
  const loadFolderProjects = useCallback(
    async (folderId: number) => {
      try {
        setBusy(true);
        const folder = await projectsService.getById(folderId);

        if (!folder) {
          services.logger.error('Folder not found');

          return;
        }

        currentProjectFolderStore.setCurrentFolder(folder);
        const projects = await projectsService.getAllProjectsInFolder(folderId);
        allProjects.setList(projects);
      } catch (error) {
        console.error('Error loading folder projects:', error);
        currentProjectFolderStore.setCurrentFolder(null);
        await loadRootProjects();
      } finally {
        setBusy(false);
      }
    },
    [loadRootProjects, setBusy]
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

  const hasProjects = allProjects.displayedList.length > 0;

  return (
    <div className={cnProjects(null, ['scroll'])}>
      {allProjects.inited ? (
        <>
          <ProjectsHeader />

          {hasProjects ? (
            <ProjectsList>
              <ProjectsContent projects={allProjects.displayedList} />
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
