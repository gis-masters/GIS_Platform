import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { cn } from '@bem-react/classname';
import { MenuItem, Tooltip } from '@material-ui/core';
import { boundMethod } from 'autobind-decorator';

import { CrgBaseMap } from '../../../services/crg/base-maps.models';
import { baseMapsStore } from '../../../stores/BaseMaps.store';
import { sleep } from '../../../services/util/sleep';

import { BaseMapsSelectThumbnail } from '../Thumbnail/BaseMapsSelect-Thumbnail';

import '!style-loader!css-loader!sass-loader!./BaseMapsSelect-Item.scss';

const cnBaseMapsSelectItem = cn('BaseMapsSelect', 'Item');

interface BaseMapsSelectItemProps {
  baseMap: CrgBaseMap;
  onClick: () => void;
}

@observer
export class BaseMapsSelectItem extends Component<BaseMapsSelectItemProps> {
  @observable private tooltipsOpen = false;

  async componentDidMount() {
    await sleep(300);
    this.openTooltip();
  }

  render() {
    const { thumbnailUrn, title } = this.props.baseMap;

    return (
      <MenuItem className={cnBaseMapsSelectItem()} onClick={this.clickHandler}>
        <BaseMapsSelectThumbnail urn={thumbnailUrn} />
      </MenuItem>
    );
  }

  @boundMethod
  private async clickHandler(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const { baseMap, onClick } = this.props;
    onClick();
    await sleep(300);
    baseMapsStore.selectBaseMap(baseMap.id);
  }

  @action
  private openTooltip() {
    this.tooltipsOpen = true;
  }
}
