import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { Role } from '../../../services/permissions/permissions.models';
import { konfirmieren } from '../../../services/utility-dialogs.service';
import { currentUser } from '../../../stores/CurrentUser.store';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Delete.scss';

const cnProjectCardDelete = cn('ProjectCard', 'Delete');

interface ProjectCardDeleteProps {
  project: CrgProject;
}

@observer
export class ProjectCardDelete extends Component<ProjectCardDeleteProps> {
  render() {
    if (!currentUser.isAdmin && this.props.project.role !== Role.OWNER) {
      return null;
    }

    return (
      <IconButton className={cnProjectCardDelete()} onClick={this.deleteProject}>
        <Delete />
      </IconButton>
    );
  }

  @boundMethod
  private async deleteProject() {
    const confirmed = await konfirmieren({
      message: 'Вы действительно хотите удалить проект?',
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await projectsService.delete(this.props.project.id);
    }
  }
}
