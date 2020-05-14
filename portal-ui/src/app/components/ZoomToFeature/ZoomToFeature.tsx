import React, { Component, createRef } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@material-ui/core';
import { MyLocation } from '@material-ui/icons';

import { WfsFeature } from '../../services/geoserver/wfs-models';
import { openLayersService } from '../../services/open-layer/open-layers.service';

const cnZoomToFeature = cn('ZoomToFeature');

interface ZoomToFeatureProps extends IClassNameProps {
  feature: WfsFeature;
  onClick?: (feature: WfsFeature) => void
}

export class ZoomToFeature extends Component<ZoomToFeatureProps> {
  private btnRef = createRef<HTMLButtonElement>();

  constructor (props: ZoomToFeatureProps) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  render () {
    const { className } = this.props;

    return (
      <Tooltip title='Перейти к объекту'>
        <IconButton className={cnZoomToFeature(null, [className])} onClick={this.clickHandler} ref={this.btnRef}>
          <MyLocation />
        </IconButton>
      </Tooltip>
    );
  }

  private clickHandler () {
    const { feature, onClick } = this.props;

    openLayersService.positionToFeature(feature);
    this.btnRef.current.blur();
    if (onClick) {
      onClick(feature);
    }
  }
}
