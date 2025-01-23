import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';

const cnProjectActionsDelete = cn('ProjectActions', 'Delete');

interface ProjectActionsDeleteProps {
  project: CrgProject;
  disabled?: boolean;
  tooltipText?: string;
}

@observer
export class ProjectActionsDelete extends Component<ProjectActionsDeleteProps> {
  render() {
    const { disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Удалить'}>
          <span>
            <IconButton className={cnProjectActionsDelete()} onClick={this.delete} disabled={disabled}>
              <DeleteOutline />
            </IconButton>
          </span>
        </Tooltip>
      </>
    );
  }

  @boundMethod
  private async delete() {
    const { project } = this.props;

    const confirmed = await konfirmieren({
      title: 'Подтверждение удаления',
      message: `Вы действительно хотите удалить "${project.name}"?`,
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await projectsService.delete(project.id);
      communicationService.projectUpdated.emit({ type: 'delete', data: project });
    }
  }
}
