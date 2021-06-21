import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { MenuItem } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { basemapsStore } from '../../../stores/Basemaps.store';
import { Basemap } from '../../../services/crg/basemaps.models';
import { sleep } from '../../../services/util/sleep';

import { BasemapsSelectThumbnail } from '../Thumbnail/BasemapsSelect-Thumbnail';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-Item.scss';

const cnBasemapsSelectItem = cn('BasemapsSelect', 'Item');

interface BasemapsSelectItemProps {
  basemap: Basemap;
  onClick: () => void;
}

@observer
export class BasemapsSelectItem extends Component<BasemapsSelectItemProps> {
  @observable private tooltipsOpen = false;

  async componentDidMount() {
    await sleep(300);
    this.openTooltip();
  }

  render() {
    const { thumbnailUrn } = this.props.basemap;

    return (
      <MenuItem className={cnBasemapsSelectItem()} onClick={this.clickHandler}>
        <BasemapsSelectThumbnail urn={thumbnailUrn} />
      </MenuItem>
    );
  }

  @boundMethod
  private async clickHandler() {
    const { basemap, onClick } = this.props;
    onClick();
    await sleep(300);
    basemapsStore.selectBasemap(basemap.id);
  }

  @action
  private openTooltip() {
    this.tooltipsOpen = true;
  }
}
