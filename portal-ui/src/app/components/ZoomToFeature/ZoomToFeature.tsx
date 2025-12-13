import React, { Component, createRef } from 'react';
import { Tooltip } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';
import { boundMethod } from 'autobind-decorator';
import Feature from 'ol/Feature';

import { getOlProjection, getProjectionByCode } from '../../services/data/projections/projections.service';
import { getFeatureById } from '../../services/geoserver/wfs/wfs.service';
import { getLayerByFeatureIdInCurrentProject } from '../../services/gis/layers/layers.utils';
import { projectsService } from '../../services/gis/projects/projects.service';
import { editFeatureStore } from '../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { selectedFeaturesStore } from '../../services/map/a-map-mode/selected-features/SelectedFeatures.store';
import { mapService } from '../../services/map/map.service';
import { services } from '../../services/services';
import { transformGeometry } from '../../services/util/coordinates-transform.util';
import { wfsGeometryToGeometry } from '../../services/util/open-layers.util';
import { IconButton } from '../IconButton/IconButton';

const cnZoomToFeature = cn('ZoomToFeature');

interface ZoomToFeatureProps extends IClassNameProps {
  featureId: string;
  disabled?: boolean;
  zoomToLastCoordinate?: boolean;
}

export class ZoomToFeature extends Component<ZoomToFeatureProps> {
  private btnRef = createRef<HTMLButtonElement>();

  render() {
    const { disabled, className } = this.props;

    return (
      <Tooltip title='Перейти к объекту'>
        <span>
          <IconButton
            className={cnZoomToFeature(null, [className])}
            onClick={this.handleClick}
            ref={this.btnRef}
            disabled={disabled}
            size='small'
          >
            <MyLocation />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  @boundMethod
  private async handleClick() {
    const { featureId, zoomToLastCoordinate } = this.props;

    if (zoomToLastCoordinate) {
      const currentGeometry = editFeatureStore.geometry;
      const currentProjection = editFeatureStore.currentProjection;
      if (!currentGeometry || !currentProjection) {
        services.logger.warn(
          `Не возможно выполнить позиционирование на фиче ${featureId}. Отсутствует геометрия или проекция`
        );

        return;
      }

      const olProjection = await getOlProjection();
      const geometry3857 = transformGeometry(currentGeometry, currentProjection, olProjection);
      if (!geometry3857) {
        services.logger.warn(
          `Не возможно выполнить позиционирование на фиче ${featureId}. Не удалось выполнить трансформацию координат в проекцию 3857`
        );

        return;
      }

      const extent = new Feature(wfsGeometryToGeometry(geometry3857)).getGeometry()?.getExtent();
      if (extent) {
        mapService.positionToExtent(extent);
      }

      this.btnRef.current?.blur();
    } else {
      const layer = getLayerByFeatureIdInCurrentProject(featureId);
      if (!layer?.complexName) {
        services.logger.warn(
          `Не возможно выполнить позиционирование на фиче ${featureId}. Слой ${layer?.id} не содержит complexName`
        );

        return;
      }

      const { complexName, resourceId, nativeCRS } = layer;
      const feature = await getFeatureById(featureId, complexName);

      if (resourceId) {
        projectsService.enableLayersByResourceId([resourceId]);
      }

      const layerProjection = await getProjectionByCode(nativeCRS);

      await mapService.positionToFeature(feature, layerProjection);

      this.btnRef.current?.blur();
      selectedFeaturesStore.setActiveFeature(feature);
    }
  }
}
