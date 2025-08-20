import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Basemap } from '../../../services/data/basemaps/basemaps.models';
import {
  connectBasemapToProject,
  fetchCurrentProjectBasemaps
} from '../../../services/gis/project-basemaps/project-basemaps.service';
import { currentProject } from '../../../stores/CurrentProject.store';
import { Button } from '../../Button/Button';
import { Explorer } from '../../Explorer/Explorer';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { BasemapsSelectAddIcon } from '../AddIcon/BasemapsSelect-AddIcon';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-AddButton.scss';

const cnBasemapsSelectAddButton = cn('BasemapsSelect', 'AddButton');

export interface BasemapsSelectAddButtonProps {
  disabledItems: Basemap[];
}

@observer
export class BasemapsSelectAddButton extends Component<BasemapsSelectAddButtonProps> {
  @observable private dialogOpen = false;
  @observable private basemap?: Basemap;

  constructor(props: BasemapsSelectAddButtonProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <>
        <Tooltip disableInteractive title={'Подключить подложку'} placement='left' arrow>
          <span>
            <MenuItem className={cnBasemapsSelectAddButton()} disableRipple>
              <BasemapsSelectAddIcon onClick={this.handleClick} />
            </MenuItem>
          </span>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeSelectBasemapDialog}>
          <DialogTitle>Выбор проекта</DialogTitle>
          <DialogContent>
            <Explorer
              className={cnBasemapsSelectAddButton('Explorer')}
              explorerRole='ConnectionsToProjectsWidget'
              preset={ExplorerItemType.BASEMAPS_ROOT}
              onSelect={this.setSelectedProject}
              onOpen={this.handleOpen}
              withoutTitle
              disabledTester={this.testForDisabled}
            />
          </DialogContent>
          <DialogActions>
            <Button color='primary' onClick={this.submitBasemapSelection}>
              Подключить
            </Button>
            <Button onClick={this.closeSelectBasemapDialog}>Отмена</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  @action.bound
  private handleClick() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeSelectBasemapDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private setSelectedProject(item: ExplorerItemData | null) {
    if (!item) {
      this.basemap = undefined;
    } else if (item.type === ExplorerItemType.BASEMAP) {
      this.basemap = item?.payload;
    }
  }

  @action.bound
  private handleOpen(item: ExplorerItemData) {
    if (item.type === ExplorerItemType.BASEMAP) {
      this.setSelectedProject(item);
      void this.submitBasemapSelection();
    }
  }

  @action.bound
  private async submitBasemapSelection() {
    if (!this.basemap) {
      return;
    }

    await connectBasemapToProject(currentProject, this.basemap);
    this.closeSelectBasemapDialog();
    await fetchCurrentProjectBasemaps();
  }

  @boundMethod
  private testForDisabled(item: ExplorerItemData): boolean {
    if (item.type !== ExplorerItemType.BASEMAP) {
      return false;
    }

    return this.props.disabledItems.some(basemap => basemap.id === item.payload.id);
  }
}
