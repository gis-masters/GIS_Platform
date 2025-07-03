import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, DeleteOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { isEqual } from 'lodash';
import { pluralize } from 'numeralize-ru';

import { Basemap } from '../../../services/data/basemaps/basemaps.models';
import { deleteBasemap } from '../../../services/data/basemaps/basemaps.service';
import { getBasemapConnections } from '../../../services/gis/project-basemaps/project-basemaps.service';
import { konfirmieren } from '../../../services/utility-dialogs.service';

const cnBasemapActionsDelete = cn('BasemapActions', 'Delete');

interface BasemapActionsDeleteProps {
  basemap: Basemap;
}

@observer
export class BasemapActionsDelete extends Component<BasemapActionsDeleteProps> {
  @observable private projectsCount = 0;
  @observable private dialogOpen = false;

  constructor(props: BasemapActionsDeleteProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await this.fetchProjectsCount();
  }

  async componentDidUpdate(prevProps: BasemapActionsDeleteProps) {
    const { basemap } = this.props;
    if (!isEqual(prevProps.basemap, basemap)) {
      this.setDialogOpen(false);
      await this.fetchProjectsCount();
    }
  }

  render() {
    return (
      <Tooltip title='Удалить'>
        <span>
          <IconButton className={cnBasemapActionsDelete()} onClick={this.handleDelete} color='error'>
            {this.dialogOpen ? <Delete /> : <DeleteOutline />}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  private async fetchProjectsCount() {
    const { basemap } = this.props;
    const connections = await getBasemapConnections(basemap);
    this.setProjectsCount(connections.length);
  }

  @action
  private setProjectsCount(count: number) {
    this.projectsCount = count;
  }

  @boundMethod
  private async handleDelete() {
    const { basemap } = this.props;
    const textProjects = pluralize(this.projectsCount, 'проекте', 'проектах', 'проектах');
    const usageText = this.projectsCount
      ? `Используется в ${this.projectsCount} ${textProjects}.`
      : 'Не используется в проектах.';

    this.setDialogOpen(true);

    const confirmed = await konfirmieren({
      title: 'Подтверждение удаления',
      message: (
        <>
          <p>{usageText}</p>
          <p>Вы действительно хотите удалить "{basemap.title}"?</p>
        </>
      ),
      okText: 'Удалить',
      cancelText: 'Отмена'
    });

    if (confirmed) {
      await deleteBasemap(basemap);
    }

    this.setDialogOpen(false);
  }

  @action
  private setDialogOpen(open: boolean) {
    this.dialogOpen = open;
  }
}
