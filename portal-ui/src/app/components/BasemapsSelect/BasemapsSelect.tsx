import React, { Component, createRef } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Menu, Paper, Tooltip, ButtonBase } from '@material-ui/core';

import { sleep } from '../../services/util/sleep';
import { basemapsStore } from '../../stores/Basemaps.store';
import { Basemap } from '../../services/crg/basemaps.models';

import { BasemapsSelectItem } from './Item/BasemapsSelect-Item';
import { BasemapsSelectThumbnail } from './Thumbnail/BasemapsSelect-Thumbnail';
import { BasemapsSelectTooltipAnchor } from './TooltipAnchor/BasemapsSelect-TooltipAnchor';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect.scss';
import '!style-loader!css-loader!sass-loader!./MenuList/BasemapsSelect-MenuList.scss';
import '!style-loader!css-loader!sass-loader!./MenuPaper/BasemapsSelect-MenuPaper.scss';

const cnBasemapsSelect = cn('BasemapsSelect');

@observer
export class BasemapsSelect extends Component {
  @observable private anchorEl: HTMLButtonElement | null = null;
  @observable private tooltipsOpen = false;
  private ref = createRef<HTMLButtonElement>();

  render() {
    const { currentBasemap } = basemapsStore;

    return (
      <>
        <Paper className={cnBasemapsSelect()} onClick={this.handleBaseClick} elevation={3}>
          <ButtonBase ref={this.ref}>
            <BasemapsSelectThumbnail urn={currentBasemap.thumbnailUrn} />
            <BasemapsSelectTooltipAnchor hidden={Boolean(this.anchorEl)} />
          </ButtonBase>
        </Paper>
        <Menu
          PaperProps={{ className: cnBasemapsSelect('MenuPaper'), square: true, elevation: 0 }}
          MenuListProps={{ className: cnBasemapsSelect('MenuList') }}
          open={Boolean(this.anchorEl)}
          anchorEl={this.anchorEl}
          onClose={this.close}
        >
          {this.basemaps.map(basemap => (
            <Tooltip title={basemap.title} key={basemap.id} placement='left' arrow open={this.tooltipsOpen}>
              <BasemapsSelectItem key={basemap.id} basemap={basemap} onClick={this.close} />
            </Tooltip>
          ))}
        </Menu>
      </>
    );
  }

  @computed
  private get basemaps(): Basemap[] {
    const { basemaps, currentBasemap } = basemapsStore;

    return [...basemaps].sort((a, b) => Number(a.id === currentBasemap.id) - Number(b.id === currentBasemap.id));
  }

  @action.bound
  private handleBaseClick() {
    this.anchorEl = this.anchorEl ? null : this.ref.current;
    void this.doTooltips();
  }

  @action.bound
  private close() {
    this.anchorEl = null;
    void this.doTooltips();
  }

  @action
  private setTooltips(open: boolean) {
    this.tooltipsOpen = open;
  }

  private async doTooltips() {
    if (this.anchorEl) {
      await sleep(300);
      this.setTooltips(true);
    } else {
      this.setTooltips(false);
    }
  }
}
