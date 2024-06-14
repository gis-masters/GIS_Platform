import React, { Component } from 'react';
import { action, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { MenuItem } from '@mui/material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Basemap } from '../../../services/data/basemaps/basemaps.models';
import { services } from '../../../services/services';
import { sleep } from '../../../services/util/sleep';
import { basemapsStore } from '../../../stores/Basemaps.store';
import { BasemapsSelectThumbnail } from '../Thumbnail/BasemapsSelect-Thumbnail';

import '!style-loader!css-loader!sass-loader!./BasemapsSelect-Item.scss';

const cnBasemapsSelectItem = cn('BasemapsSelect', 'Item');

interface BasemapsSelectItemProps {
  basemap: Basemap;
  onClick(): void;
}

@observer
export class BasemapsSelectItem extends Component<BasemapsSelectItemProps> {
  @observable private tooltipsOpen = false;

  constructor(props: BasemapsSelectItemProps) {
    super(props);
    makeObservable(this);
  }

  async componentDidMount() {
    await sleep(300);
    this.openTooltip();
  }

  render() {
    const { thumbnailUrn } = this.props.basemap;

    return (
      <MenuItem className={cnBasemapsSelectItem()} onClick={this.handleClick}>
        <BasemapsSelectThumbnail urn={thumbnailUrn} />
      </MenuItem>
    );
  }

  @boundMethod
  private async handleClick() {
    const { basemap, onClick } = this.props;
    onClick();
    await sleep(300);
    basemapsStore.selectBasemap(basemap.id);

    await services.router.navigate([location.pathname], {
      queryParams: {
        basemap: basemap.id
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  @action
  private openTooltip() {
    this.tooltipsOpen = true;
  }
}
