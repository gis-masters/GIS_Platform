import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { projectsService } from '../../../services/crg/projects.service';
import { CrgProject } from '../../../services/crg/projects.models';
import { currentUser } from '../../../stores/CurrentUser.store';
import { Role } from '../../../services/crg/permissions.models';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Delete.scss';

const cnProjectCardDelete = cn('ProjectCard', 'Delete');

interface ProjectCardDeleteProps {
  project: CrgProject;
}

@observer
export class ProjectCardDelete extends Component<ProjectCardDeleteProps> {
  @observable private dialogOpen = false;

  render() {
    if (!currentUser.isAdmin && this.props.project.role !== Role.OWNER) {
      return null;
    }

    return (
      <>
        <IconButton className={cnProjectCardDelete()} onClick={this.openDeleteDialog}>
          <Delete />
        </IconButton>

        <Dialog open={this.dialogOpen} onClose={this.closeDeleteDialog}>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить проект?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteProject} color='primary'>
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
