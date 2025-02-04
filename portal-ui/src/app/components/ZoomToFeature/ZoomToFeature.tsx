import React, { Component, createRef } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';

import { WfsFeature } from '../../services/geoserver/wfs/wfs.models';
import { getFeaturesById } from '../../services/geoserver/wfs/wfs.service';
import { getLayerByFeatureInCurrentProject } from '../../services/gis/layers/layers.utils';
import { projectsService } from '../../services/gis/projects/projects.service';
import { mapService } from '../../services/map/map.service';

const cnZoomToFeature = cn('ZoomToFeature');

interface ZoomToFeatureProps extends IClassNameProps {
  feature: WfsFeature;
  disabled?: boolean;
  onClick?(feature: WfsFeature): void;
}

export class ZoomToFeature extends Component<ZoomToFeatureProps> {
  private btnRef = createRef<HTMLButtonElement>();

  render() {
    const { disabled, className } = this.props;

    return (
      <Tooltip title='Перейти к объекту'>
        <IconButton
          className={cnZoomToFeature(null, [className])}
          onClick={this.handleClick}
          ref={this.btnRef}
          disabled={disabled}
          size='small'
        >
          <MyLocation />
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private async handleClick() {
    const { onClick } = this.props;
    let { feature } = this.props;
    const layer = getLayerByFeatureInCurrentProject(feature);

    if (layer?.complexName && !feature.geometry?.coordinates.length) {
      const [currentFeature] = await getFeaturesById([feature.id], layer?.complexName);

      feature = currentFeature;
    }

    if (layer?.tableName) {
      projectsService.enableLayersByTableNames([layer.tableName]);
    }

    await mapService.positionToFeature(feature);
    this.btnRef.current?.blur();

    if (onClick) {
      onClick(feature);
    }
  }
}
