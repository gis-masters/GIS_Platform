import React, { Component, createRef } from 'react';
import { AxiosError } from 'axios';
import { observer } from 'mobx-react';
import { action, observable, makeObservable } from 'mobx';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { AddBoxOutlined } from '@mui/icons-material';

import { organizationSettings } from '../../stores/OrganizationSettings.store';
import { communicationService } from '../../services/communication.service';
import { projectsService } from '../../services/gis/projects.service';
import { CrgProject } from '../../services/gis/projects.models';
import { allProjects } from '../../stores/AllProjects.store';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { ProjectsAdd } from '../ProjectAdd/ProjectsAdd';
import { sleep } from '../../services/util/sleep';
import { Toast } from '../Toast/Toast';

import { ProjectsFilter } from './Filter/Projects-Filter';
import { ProjectsLoader } from './Loader/Projects-Loader';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';
import { ProjectsSortBy } from './SortBy/Projects-SortBy';
import { ProjectsSortOrder } from './SortOrder/Projects-SortOrder';

import '!style-loader!css-loader!sass-loader!./Projects.scss';
import '!style-loader!css-loader!sass-loader!./Add/Projects-Add.scss';

const cnProjects = cn('Projects');

@observer
export class Projects extends Component {
  private thisRef = createRef<HTMLDivElement>();
  private newProjectRef = createRef<HTMLDivElement>();

  @observable private newProjectId = 0;
  @observable private addFormBusy = false;
  @observable private addFormOpen = false;
  @observable private addFormErrors: string[] = [];

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await projectsService.initAllProjectsStore();

    communicationService.projectCreated.on(this.scrollTo, this);
  }

  componentWillUnmount() {
    communicationService.off(this);
  }

  render() {
    return (
      <div className={cnProjects(null, ['scroll'])} ref={this.thisRef}>
        {!allProjects.inited ? (
          <ProjectsLoader />
        ) : (
          <>
            <ProjectsHeader>
              <ProjectsFilter />
              <ProjectsSortBy />
              <ProjectsSortOrder />
              {organizationSettings.createProject && (
                <ProjectsAdd
                  className={cnProjects('Add')}
                  busy={this.addFormBusy}
                  onSubmit={this.handleProjectCreation}
                  onChange={this.setErrors}
                  onClose={this.closeAddForm}
                  onOpen={this.openAddForm}
                  open={this.addFormOpen}
                  errors={this.addFormErrors}
                  buttonProps={{
                    variant: 'contained',
                    color: 'primary',
                    startIcon: <AddBoxOutlined />
                  }}
                />
              )}
            </ProjectsHeader>
            <ProjectsList>
              {allProjects.displayedList.map((project, i) => (
                <ProjectCard
                  className={cnProjects('Card')}
                  project={project}
                  key={i}
                  cardRef={this.newProjectId === project.id ? this.newProjectRef : undefined}
                />
              ))}
            </ProjectsList>
          </>
        )}
      </div>
    );
  }

  @boundMethod
  private async scrollTo(project: CrgProject) {
    this.setNewProjectId(project.id);

    await sleep(200);

    const containerElem = this.thisRef.current;
    const projectElem = this.newProjectRef.current;

    if (containerElem.scrollTop < projectElem.offsetTop + projectElem.offsetHeight) {
      containerElem.scrollTo({ top: projectElem.offsetTop + projectElem.offsetHeight, behavior: 'smooth' });
    }
    if (containerElem.scrollTop > projectElem.offsetTop) {
      containerElem.scrollTo({ top: projectElem.offsetTop - projectElem.offsetHeight, behavior: 'smooth' });
    }
  }

  @action
  private setNewProjectId(id: number) {
    this.newProjectId = id;
  }

  @boundMethod
  private async handleProjectCreation(name: string) {
    if (this.addFormBusy) {
      return;
    }

    this.setErrors([]);
    this.setBusy(true);

    try {
      const newProject = await projectsService.create(name);
      communicationService.allProjectsFetched.once(() => {
        communicationService.projectCreated.emit(newProject);
      });
      Toast.success('Проект создан');

      this.closeAddForm();
    } catch (error) {
      const err = error as AxiosError<{ errors: Record<string, unknown>[] }>;
      if (err.response?.status === 409) {
        this.setErrors([err?.message]);
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

        this.setErrors(errors);
      }
    } finally {
      this.setBusy(false);
    }
  }

  @action.bound
  private closeAddForm() {
    this.addFormOpen = false;
  }

  @action.bound
  private openAddForm() {
    this.addFormOpen = true;
  }

  @action.bound
  setErrors(errors: string[] = []): void {
    this.addFormErrors = errors;
  }

  @action
  private setBusy(busy: boolean) {
    this.addFormBusy = busy;
  }
}
