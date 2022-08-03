import React, { Component } from 'react';
import { action, observable, makeObservable } from 'mobx';
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

import { communicationService } from '../../../services/communication.service';
import { projectsService } from '../../../services/gis/projects.service';
import { CrgProject } from '../../../services/gis/projects.models';
import { Button } from '../../Button/Button';

const cnProjectActionsDelete = cn('ProjectActions', 'Delete');

interface ProjectActionsDeleteProps {
  project: CrgProject;
}

@observer
export class ProjectActionsDelete extends Component<ProjectActionsDeleteProps> {
  @observable private dialogOpen = false;

  constructor(props: ProjectActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  componentDidUpdate(prevProps: ProjectActionsDeleteProps) {
    if (prevProps.project.id !== this.props.project.id) {
      this.closeDialog();
    }
  }

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
