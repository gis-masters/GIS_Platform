import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Delete, DeleteOutline } from '@mui/icons-material';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { CrgProject } from '../../../services/crg/projects.models';
import { Button } from '../../Button/Button';
import { projectsService } from '../../../services/crg/projects.service';
import { communicationService } from '../../../services/communication.service';

const cnProjectActionsDelete = cn('ProjectActions', 'Delete');

interface ProjectActionsDeleteProps {
  project: CrgProject;
}

@observer
export class ProjectActionsDelete extends Component<ProjectActionsDeleteProps> {
  @observable private dialogOpen = false;

  render() {
    const { project } = this.props;

    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnProjectActionsDelete()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить "{project.name}"?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.doDeletion} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private openDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async doDeletion() {
    const { project } = this.props;

    await projectsService.delete(project.id);
    communicationService.projectsUpdated.emit();
  }
}
