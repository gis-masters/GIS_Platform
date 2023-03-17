import React, { Component } from 'react';
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip } from '@mui/material';
import { boundMethod } from 'autobind-decorator';

import { currentProject } from '../../../stores/CurrentProject.store';
import { connectBasemapToProject, fetchBasemaps } from '../../../services/gis/project-basemaps.service';
import { ExplorerItemData, ExplorerItemType } from '../../Explorer/Explorer.models';
import { Basemap } from '../../../services/data/basemaps/basemaps.models';
import { Explorer } from '../../Explorer/Explorer';
import { Button } from '../../Button/Button';

import { BasemapsSelectAddIcon } from '../AddIcon/BasemapsSelect-AddIcon';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-AddButton.scss';

const cnBasemapsSelectAddButton = cn('BasemapsSelect', 'AddButton');

export interface BasemapsSelectAddButtonProps {
  disabledItems: Basemap[];
}

@observer
export class BasemapsSelectAddButton extends Component<BasemapsSelectAddButtonProps> {
  @observable private dialogOpen = false;
  @observable private basemap: Basemap;

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
              <BasemapsSelectAddIcon onClick={this.clickHandler} />
            </MenuItem>
          </span>
        </Tooltip>

        <Dialog open={this.dialogOpen} onClose={this.closeSelectBasemapDialog}>
          <DialogTitle>Выбор проекта</DialogTitle>
          <DialogContent>
            <Explorer
              className={cnBasemapsSelectAddButton('Explorer')}
              id='ConnectionsToProjectsWidget'
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
  private clickHandler() {
    this.dialogOpen = true;
  }

  @action.bound
  private closeSelectBasemapDialog() {
    this.dialogOpen = false;
  }

  @action.bound
  private setSelectedProject(item: ExplorerItemData | null) {
    this.basemap = item.payload as Basemap;
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
    await connectBasemapToProject(currentProject, this.basemap);
    this.closeSelectBasemapDialog();
    await fetchBasemaps();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @boundMethod
  private async testForDisabled({ payload }: ExplorerItemData<Basemap>): Promise<boolean> {
    return this.props.disabledItems.some(basemap => basemap.id === payload.id);
  }
}
