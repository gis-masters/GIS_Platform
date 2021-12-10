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
import { pluralize } from 'numeralize-ru';
import { cn } from '@bem-react/classname';
import { isEqual } from 'lodash';

import { Basemap } from '../../../services/crg/basemaps.models';
import { deleteBasemap, getBasemapConnections } from '../../../services/crg/basemaps.service';
import { Button } from '../../Button/Button';

const cnBasemapActionsDelete = cn('BasemapActions', 'Delete');

interface BasemapActionsDeleteProps {
  basemap: Basemap;
}

@observer
export class BasemapActionsDelete extends Component<BasemapActionsDeleteProps> {
  @observable private dialogOpen = false;
  @observable private btnLoading: boolean;
  @observable private projectsCount: number;

  async componentDidMount() {
    await this.fetchProjectsCount();
  }

  async componentDidUpdate(prevProps: BasemapActionsDeleteProps) {
    const { basemap } = this.props;
    if (!isEqual(prevProps.basemap, basemap)) {
      await this.fetchProjectsCount();
    }
  }

  render() {
    const { basemap } = this.props;
    const textProjects = pluralize(this.projectsCount, 'проекте', 'проектах', 'проектах');

    return (
      <>
        <Tooltip title='Удалить'>
          <IconButton className={cnBasemapActionsDelete()} onClick={this.openDialog}>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>Подтверждение удаления</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.projectsCount
                ? `Используется в ${this.projectsCount} ${textProjects}.`
                : 'Не используется в проектах.'}
            </DialogContentText>
            <DialogContentText>Вы действительно хотите удалить "{basemap.title}"?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button loading={this.btnLoading} onClick={this.doDeletion} color='primary'>
              Удалить
            </Button>
            <Button onClick={this.closeDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  private async fetchProjectsCount() {
    const { basemap } = this.props;
    this.setProjectsCount((await getBasemapConnections(basemap.id)).length);
  }

  @action
  private setProjectsCount(count: number) {
    this.projectsCount = count;
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
    await deleteBasemap(this.props.basemap.id);
  }
}
