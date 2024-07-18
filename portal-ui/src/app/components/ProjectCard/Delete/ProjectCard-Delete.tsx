import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { CrgProject } from '../../../services/gis/projects/projects.models';
import { projectsService } from '../../../services/gis/projects/projects.service';
import { Role } from '../../../services/permissions/permissions.models';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Delete.scss';

const cnProjectCardDelete = cn('ProjectCard', 'Delete');
const cnProjectCardDeleteDialog = cn('ProjectCard', 'DeleteDialog');
const cnProjectCardDeleteDialogYes = cn('ProjectCard', 'DeleteDialogYes');

interface ProjectCardDeleteProps {
  project: CrgProject;
}

@observer
export class ProjectCardDelete extends Component<ProjectCardDeleteProps> {
  @observable private dialogOpen = false;

  constructor(props: ProjectCardDeleteProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    if (!currentUser.isAdmin && this.props.project.role !== Role.OWNER) {
      return null;
    }

    return (
      <>
        <IconButton className={cnProjectCardDelete()} onClick={this.openDeleteDialog}>
          <Delete />
        </IconButton>

        <Dialog
          open={this.dialogOpen}
          onClose={this.closeDeleteDialog}
          PaperProps={{ className: cnProjectCardDeleteDialog() }}
        >
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить проект?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteProject} color='primary' className={cnProjectCardDeleteDialogYes()}>
              Да
            </Button>
            <Button onClick={this.closeDeleteDialog}>Нет</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private openDeleteDialog() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeDeleteDialog() {
    this.dialogOpen = false;
  }

  @boundMethod
  private async deleteProject() {
    await projectsService.delete(this.props.project.id);
    this.closeDeleteDialog();
  }
}
