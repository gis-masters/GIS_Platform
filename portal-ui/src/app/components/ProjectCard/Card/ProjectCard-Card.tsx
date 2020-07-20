import React, { Component } from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import DeleteIcon from '@material-ui/icons/Delete';
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { projectsService } from '../../../services/crg/projects.service';
import { Project } from '../../../services/crg/projects.models';
import { getEnvironment } from '../../../services/environment';
import { Link } from '../../Link/Link';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./ProjectCard-Card.scss';

const cnProjectCard = cn('ProjectCard');

interface ProjectCardCardProps {
  project: Project;
}

@observer
export class ProjectCardCard extends Component<ProjectCardCardProps> {
  @observable private isDeleteDialogOpen = false;
  @observable private isDeleteButtonShown = false;

  @computed
  private get url(): string {
    const { id, layers } = this.props.project;

    return layers.length ? `/projects/${id}/map` : `/projects/${id}/import`;
  }

  async componentDidMount() {
    const { platform } = await getEnvironment();
    if (platform !== 'simf') {
      this.showDeleteButton();
    }
  }

  render() {
    const { project } = this.props;

    return (
      <>
        <div className={cnProjectCard('Card')}>
          {this.isDeleteButtonShown ? (
            <DeleteIcon className={cnProjectCard('Delete')} onClick={this.openDeleteDialog} />
          ) : null}
          <div className={cnProjectCard('Name')}>{project.name}</div>
        </div>

        <Link className={cnProjectCard('Footer')} url={this.url}>
          Открыть
        </Link>

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

  @action
  private showDeleteButton() {
    this.isDeleteButtonShown = true;
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
