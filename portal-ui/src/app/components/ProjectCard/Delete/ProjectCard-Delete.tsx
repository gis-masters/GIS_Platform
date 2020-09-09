import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { projectsService } from '../../../services/crg/projects.service';
import { isAdmin } from '../../../services/crg/permissions.service';
import { Project } from '../../../services/crg/projects.models';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Delete.scss';

const cnProjectCardDelete = cn('ProjectCard', 'Delete');

interface ProjectCardDeleteProps {
  project: Project;
}

@observer
export class ProjectCardDelete extends Component<ProjectCardDeleteProps> {
  @observable private isDeleteDialogOpen = false;
  private isShown: boolean;

  constructor(props: ProjectCardDeleteProps) {
    super(props);

    this.isShown = isAdmin();
  }

  render() {
    if (!this.isShown) {
      return null;
    }

    return (
      <>
        <IconButton className={cnProjectCardDelete()} onClick={this.openDeleteDialog}>
          <Delete />
        </IconButton>

        <Dialog open={this.isDeleteDialogOpen} onClose={this.closeDeleteDialog}>
          <DialogContent>
            <DialogContentText>Вы действительно хотите удалить проект?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.deleteProject} color='primary'>
              Ok
            </Button>
            <Button onClick={this.closeDeleteDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private openDeleteDialog() {
    this.isDeleteDialogOpen = true;
  }

  @action.bound
  private closeDeleteDialog() {
    this.isDeleteDialogOpen = false;
  }

  @boundMethod
  private async deleteProject() {
    await projectsService.delete(this.props.project.id);
    this.closeDeleteDialog();
  }
}
