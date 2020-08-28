import React, { Component, createRef } from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { Menu, Paper, Tooltip, ButtonBase } from '@material-ui/core';

import { sleep } from '../../services/util/sleep';
import { baseMapsStore } from '../../stores/BaseMaps.store';
import { CrgBaseMap } from '../../services/crg/base-maps.models';

import { BaseMapsSelectItem } from './Item/BaseMapsSelect-Item';
import { BaseMapsSelectThumbnail } from './Thumbnail/BaseMapsSelect-Thumbnail';
import { BaseMapsSelectTooltipAnchor } from './TooltipAnchor/BaseMapsSelect-TooltipAnchor';

import '!style-loader!css-loader!sass-loader!./BaseMapsSelect.scss';
import '!style-loader!css-loader!sass-loader!./MenuList/BaseMapsSelect-MenuList.scss';
import '!style-loader!css-loader!sass-loader!./MenuPaper/BaseMapsSelect-MenuPaper.scss';

const cnBaseMapsSelect = cn('BaseMapsSelect');

@observer
export class BaseMapsSelect extends Component {
  @observable private anchorEl: HTMLButtonElement | null = null;
  @observable private tooltipsOpen = false;
  private ref = createRef<HTMLButtonElement>();

  render() {
    const { currentBaseMap } = baseMapsStore;

    return (
      <>
        <Paper className={cnBaseMapsSelect()} onClick={this.handleBaseClick} elevation={3}>
          <ButtonBase ref={this.ref}>
            <BaseMapsSelectThumbnail urn={currentBaseMap.thumbnailUrn} />
            <BaseMapsSelectTooltipAnchor hidden={Boolean(this.anchorEl)} />
          </ButtonBase>
        </Paper>
        <Menu
          PaperProps={{ className: cnBaseMapsSelect('MenuPaper'), square: true, elevation: 0 }}
          MenuListProps={{ className: cnBaseMapsSelect('MenuList') }}
          open={Boolean(this.anchorEl)}
          anchorEl={this.anchorEl}
          onClose={this.close}
        >
          {this.baseMaps.map(baseMap => (
            <Tooltip title={baseMap.title} key={baseMap.id} placement='left' arrow open={this.tooltipsOpen}>
              <BaseMapsSelectItem key={baseMap.id} baseMap={baseMap} onClick={this.close} />
            </Tooltip>
          ))}
        </Menu>
      </>
    );
  }

  @computed
  private get baseMaps(): CrgBaseMap[] {
    const { baseMaps, currentBaseMap } = baseMapsStore;
    const baseMapsWithCurrentLast = [...baseMaps].sort(
      (a, b) => Number(a.id === currentBaseMap.id) - Number(b.id === currentBaseMap.id)
    );

    return baseMapsWithCurrentLast;
  }

  @action.bound
  private handleBaseClick(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    this.anchorEl = this.anchorEl ? null : this.ref.current;
    this.doTooltips();
  }

  @action.bound
  private close() {
    this.anchorEl = null;
    this.doTooltips();
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
