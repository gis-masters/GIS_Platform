import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { AddBoxOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { AxiosError } from 'axios';

import { communicationService, DataChangeEventDetail } from '../../services/communication.service';
import { CrgProject } from '../../services/gis/projects/projects.models';
import { projectsService } from '../../services/gis/projects/projects.service';
import { sleep } from '../../services/util/sleep';
import { allProjects } from '../../stores/AllProjects.store';
import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { ProjectsAdd } from '../ProjectAdd/ProjectsAdd';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { ProjectFolder } from '../ProjectFolder/ProjectFolder';
import { Toast } from '../Toast/Toast';
import { ProjectsFilter } from './Filter/Projects-Filter';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';
import { ProjectsLoader } from './Loader/Projects-Loader';
import { ProjectsSortBy } from './SortBy/Projects-SortBy';
import { ProjectsSortOrder } from './SortOrder/Projects-SortOrder';

import '!style-loader!css-loader!sass-loader!./Projects.scss';
import '!style-loader!css-loader!sass-loader!./Add/Projects-Add.scss';

const cnProjects = cn('Projects');

const Projects: React.FC = observer(() => {
  const thisRef = useRef<HTMLDivElement>(null);
  const newProjectRef = useRef<HTMLDivElement>(null);

  const [newProjectId, setNewProjectId] = useState(0);
  const [addFormBusy, setAddFormBusy] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addFormErrors, setAddFormErrors] = useState<string[]>([]);

  const scrollTo = async (project: CrgProject) => {
    setNewProjectId(project.id);

    const waitForRefTimeout = 2500;
    const waitForRefStep = 50;
    for (let i = 0; i < waitForRefTimeout; i += waitForRefStep) {
      await sleep(50);
      if (newProjectRef.current) {
        break;
      }
    }

    if (!newProjectRef.current) {
      return;
    }

    const containerElem = thisRef.current;
    const projectElem = newProjectRef.current;

    if (containerElem) {
      if (containerElem.scrollTop < projectElem.offsetTop + projectElem.offsetHeight) {
        containerElem.scrollTo({ top: projectElem.offsetTop + projectElem.offsetHeight, behavior: 'smooth' });
      }
      if (containerElem.scrollTop > projectElem.offsetTop) {
        containerElem.scrollTo({ top: projectElem.offsetTop - projectElem.offsetHeight, behavior: 'smooth' });
      }
    }

    await sleep(2000);
    setNewProjectId(0);
  };

  const handleProjectCreation = async (name: string) => {
    if (addFormBusy) {
      return;
    }

    setAddFormErrors([]);
    setAddFormBusy(true);

    try {
      const newProject = await projectsService.create({ name, folder: false });
      communicationService.allProjectsFetched.once(() => {
        communicationService.projectUpdated.emit({ type: 'create', data: newProject });
      });
      Toast.success('Проект создан');

      closeAddForm();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[] }>;
      if (err.response?.status === 409) {
        setAddFormErrors([err?.message]);
      } else {
        const errors: string[] = [];
        err.response?.data?.errors?.forEach(({ message }) => {
          if (message) {
            errors.push(message as string);
          }
        });

        if (!errors.length) {
          errors.push('Не удалось создать проект');
        }

        setAddFormErrors(errors);
      }
    } finally {
      setAddFormBusy(false);
    }
  };

  const closeAddForm = () => {
    setAddFormOpen(false);
    setAddFormErrors([]);
  };

  const openAddForm = () => {
    setAddFormOpen(true);
  };

  const setErrors = useCallback((errors: string[] = []) => {
    setAddFormErrors(errors);
  }, []);

  useEffect(() => {
    const init = async () => {
      await projectsService.initAllProjectsStore();
    };

    void init();

    const handleProjectUpdate = async (e: CustomEvent<DataChangeEventDetail<CrgProject>>) => {
      const { type, data } = e.detail;
      if (type === 'create') {
        await scrollTo(data);
      }
    };

    communicationService.projectUpdated.on(handleProjectUpdate);

    return () => {
      communicationService.off(handleProjectUpdate);
    };
  }, []);

  return (
    <div className={cnProjects(null, ['scroll'])} ref={thisRef}>
      {allProjects.inited ? (
        <>
          <ProjectsHeader>
            <ProjectsFilter />
            <ProjectsSortBy />
            <ProjectsSortOrder />
            {organizationSettings.createProject && (
              <ProjectsAdd
                className={cnProjects('Add')}
                busy={addFormBusy}
                onSubmit={handleProjectCreation}
                onChange={setErrors}
                onClose={closeAddForm}
                onOpen={openAddForm}
                open={addFormOpen}
                errors={addFormErrors}
                title='Создать проект'
                buttonProps={{
                  variant: 'contained',
                  color: 'primary',
                  startIcon: <AddBoxOutlined />
                }}
              />
            )}
          </ProjectsHeader>
          <ProjectsList>
            {allProjects.displayedList.filter(proj => !proj.folder).map((project, i) => (
              project.folder ? <ProjectFolder
                className={cnProjects('Card')}
                project={project}
                key={i}
                cardRef={newProjectId === project.id ? newProjectRef : undefined}
              />
                :
                <ProjectCard
                  className={cnProjects('Card')}
                  project={project}
                  key={i}
                  cardRef={newProjectId === project.id ? newProjectRef : undefined}
                />
            ))}
          </ProjectsList>
        </>
      ) : (
        <ProjectsLoader />
      )}
    </div>
  );
});

export default Projects;
