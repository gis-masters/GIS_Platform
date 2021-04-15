import React, { Component, createRef } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../services/communication.service';
import { projectsService } from '../../services/crg/projects.service';
import { CrgProject } from '../../services/crg/projects.models';
import { allProjects } from '../../stores/AllProjects.store';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { sleep } from '../../services/util/sleep';

import { ProjectsLoader } from './Loader/Projects-Loader';
import { ProjectsHeader } from './Header/Projects-Header';
import { ProjectsList } from './List/Projects-List';

import '!style-loader!css-loader!sass-loader!./Projects.scss';

const cnProjects = cn('Projects');

@observer
export class Projects extends Component {
  private thisRef = createRef<HTMLDivElement>();
  private newProjectRef = createRef<HTMLDivElement>();
  @observable private newProjectId = 0;

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
            <ProjectsHeader />
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
}
