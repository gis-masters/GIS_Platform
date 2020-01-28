import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { projectsList } from '../../stores/ProjectsList.store';
import { services } from '../../services/services';
import { getEnvironment } from '../../services/environment';
import { ProjectCard } from '../ProjectCard/ProjectCard';

import '!style-loader!css-loader!sass-loader!./ProjectsList.scss';
import {ProjectsListLoader} from './Loader/ProjectsList-Loader';

const cnProjectsList = cn('ProjectsList');

@observer
export class ProjectsList extends React.Component<{}> {
  @observable
  private isCreationEnabled = false;

  async componentDidMount () {
    const { platform } = await getEnvironment();
    if (platform !== 'simf') {
      this.enableCreation();
    }
    await services.provided;
    const { dataSchemaService, projectsService } = services;
    dataSchemaService.getFeaturesSchemas().subscribe();
    await projectsService.fetchProjects();
  }

  render () {
    return (
      <div className={cnProjectsList()}>
        {!projectsList.isLoaded ? <ProjectsListLoader /> : (
          <>
            {projectsList.list.map((project, i) => (
              <ProjectCard className={cnProjectsList('Card')} project={project} typ='card' key={i} />
            ))}
            {this.isCreationEnabled ?
                <ProjectCard className={cnProjectsList('Card')} typ='add' /> :
                null}
          </>
        )}
      </div>
    );
  }

  @action
  private enableCreation () {
    this.isCreationEnabled = !this.isCreationEnabled;
  }
}
