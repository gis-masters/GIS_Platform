import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';

import { currentUser } from '../../stores/CurrentUser.store';
import { CrgProject } from '../../services/crg/projects.models';

import { ProjectActionsDelete } from './Delete/ProjectActions-Delete';
import { Role } from '../../services/crg/permissions.models';

const cnProjectsActions = cn('ProjectsActions');

interface ProjectsActionsProps {
  project: CrgProject;
}

@observer
export class ProjectsActions extends Component<ProjectsActionsProps> {
  render() {
    const { project } = this.props;
    const deletionAllowed = currentUser.isAdmin || project.role === Role.OWNER;

    return <div className={cnProjectsActions()}>{deletionAllowed && <ProjectActionsDelete project={project} />}</div>;
  }
}
