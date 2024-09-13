import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { communicationService } from '../../../services/communication.service';
import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { Button } from '../../Button/Button';

const cnProjectActionsDelete = cn('ProjectActions', 'Delete');
const cnProjectActionsDeleteDialog = cn('ProjectActions', 'DeleteDialog');

interface ProjectActionsDeleteProps {
  project: CrgProject;
  disabled?: boolean;
  tooltipText?: string;
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
    const { project, disabled, tooltipText } = this.props;

    return (
      <>
        <Tooltip title={disabled && tooltipText ? tooltipText : 'Удалить'}>
          <span>
            <IconButton className={cnProjectActionsDelete()} onClick={this.openDialog} disabled={disabled}>
              {this.dialogOpen ? <Delete /> : <DeleteOutline />}
            </IconButton>
          </span>
        </Tooltip>

        <Dialog open={this.dialogOpen} className={cnProjectActionsDeleteDialog()} onClose={this.closeDialog}>
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
    communicationService.projectUpdated.emit({ type: 'delete', data: project });
  }
}
