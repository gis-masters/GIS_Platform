import React, { Component, createRef } from 'react';
import { IClassNameProps } from '@bem-react/core';
import { cn } from '@bem-react/classname';
import { IconButton, Tooltip } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { mapService } from '../../services/map/map.service';

const cnZoomToFeature = cn('ZoomToFeature');

interface ZoomToFeatureProps extends IClassNameProps {
  feature: WfsFeature;
  onClick?: (feature: WfsFeature) => void;
}

export class ZoomToFeature extends Component<ZoomToFeatureProps> {
  private btnRef = createRef<HTMLButtonElement>();

  render() {
    const { className } = this.props;

    return (
      <Tooltip title='Перейти к объекту'>
        <IconButton className={cnZoomToFeature(null, [className])} onClick={this.clickHandler} ref={this.btnRef}>
          <MyLocation />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private clickHandler() {
    const { feature, onClick } = this.props;

    mapService.positionToFeature(feature);
    this.btnRef.current.blur();
    if (onClick) {
      onClick(feature);
    }
  }
}
