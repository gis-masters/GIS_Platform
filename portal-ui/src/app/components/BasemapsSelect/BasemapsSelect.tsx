import React, { Component, createRef } from 'react';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ButtonBase, Menu, Paper, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Basemap } from '../../services/data/basemaps/basemaps.models';
import { Role } from '../../services/permissions/permissions.models';
import { sleep } from '../../services/util/sleep';
import { basemapsStore } from '../../stores/Basemaps.store';
import { currentProject } from '../../stores/CurrentProject.store';
import { currentUser } from '../../stores/CurrentUser.store';
import { BasemapsSelectAddButton } from './AddButton/BasemapsSelect-AddButton';
import { BasemapsSelectItem } from './Item/BasemapsSelect-Item';
import { BasemapsSelectThumbnail } from './Thumbnail/BasemapsSelect-Thumbnail';
import { BasemapsSelectTooltipAnchor } from './TooltipAnchor/BasemapsSelect-TooltipAnchor';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect.scss';
import '!style-loader!css-loader!sass-loader!./MenuList/BasemapsSelect-MenuList.scss';
import '!style-loader!css-loader!sass-loader!./MenuPaper/BasemapsSelect-MenuPaper.scss';

const cnBasemapsSelect = cn('BasemapsSelect');

@observer
export class BasemapsSelect extends Component {
  @observable private tooltipsOpen = false;
  @observable private open = false;
  @observable private ready = false;
  private ref = createRef<HTMLButtonElement>();

  constructor(props: Record<string, never>) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    this.setReady();
  }

  render() {
    const { currentBasemap } = basemapsStore;

    return (
      <>
        {currentBasemap && (
          <Paper className={cnBasemapsSelect()} onClick={this.handleBaseClick} elevation={3}>
            <span ref={this.ref}>
              <ButtonBase>
                <BasemapsSelectThumbnail urn={currentBasemap.thumbnailUrn} />
                <BasemapsSelectTooltipAnchor hidden={this.open} ready={this.ready} />
              </ButtonBase>
            </span>
          </Paper>
        )}
        {this.ready && (
          <Menu
            PaperProps={{ className: cnBasemapsSelect('MenuPaper'), square: true, elevation: 0 }}
            MenuListProps={{ className: cnBasemapsSelect('MenuList') }}
            open={this.open}
            anchorEl={this.ref.current}
            onClose={this.close}
            transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {(currentUser.isAdmin || currentProject.role === Role.OWNER) && (
              <BasemapsSelectAddButton disabledItems={this.basemaps} />
            )}
            {this.basemaps.map(basemap => (
              <Tooltip
                disableInteractive
                title={basemap.title}
                key={basemap.id}
                placement='left'
                arrow
                open={this.tooltipsOpen}
              >
                <span>
                  <BasemapsSelectItem key={basemap.id} basemap={basemap} onClick={this.close} />
                </span>
              </Tooltip>
            ))}
          </Menu>
        )}
      </>
    );
  }

  @computed
  private get basemaps(): Basemap[] {
    const { basemaps, currentBasemap } = basemapsStore;

    return [...basemaps].sort((a, b) => Number(a.id === currentBasemap?.id) - Number(b.id === currentBasemap?.id));
  }

  @action.bound
  private handleBaseClick() {
    this.open = !this.open;
    void this.doTooltips();
  }

  @action.bound
  private close() {
    this.open = false;
    void this.doTooltips();
  }

  @action
  private setTooltips(open: boolean) {
    this.tooltipsOpen = open;
  }

  @action
  private setReady() {
    this.ready = true;
  }

  private async doTooltips() {
    if (this.open) {
      await sleep(300);
      this.setTooltips(true);
    } else {
      this.setTooltips(false);
    }
  }
}
