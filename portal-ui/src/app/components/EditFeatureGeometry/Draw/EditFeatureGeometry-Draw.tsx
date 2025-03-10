import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined, SvgIconComponent } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';
import SimpleGeometry from 'ol/geom/SimpleGeometry';
import { DrawEvent } from 'ol/interaction/Draw';

import { Emitter } from '../../../services/common/Emitter';
import { communicationService } from '../../../services/communication.service';
import { GeometryType } from '../../../services/geoserver/wfs/wfs.models';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { SingleDrawGeometryType } from '../../../services/map/draw/map-draw.models';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { toDrawGeometry } from '../../../services/map/draw/map-draw.util';
import { MapMode } from '../../../services/map/map.models';
import { services } from '../../../services/services';
import { transform, transformCoordinates } from '../../../services/util/coordinates-transform.util';
import { isCoordinate, isCoordinateArrayArray } from '../../../services/util/typeGuards/isCoordinate';
import { mapStore } from '../../../stores/Map.store';
import { projectionsStore } from '../../../stores/Projections.store';
import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometryDraw');

interface EditFeatureGeometryDrawProps {
  Icon?: SvgIconComponent;
  IconWhenActive?: SvgIconComponent;
  tip?: string;
  onDraw(val: Coordinate | Coordinate[]): void;
}

@observer
export class EditFeatureGeometryDraw extends Component<EditFeatureGeometryDrawProps> {
  constructor(props: EditFeatureGeometryDrawProps) {
    super(props);

    communicationService.drawEnd.on((event: CustomEvent<DrawEvent>) => {
      this.handleDraw(event.detail);
    }, this);
  }

  componentWillUnmount() {
    mapDrawService.drawOff();

    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    const { Icon, IconWhenActive, tip } = this.props;
    const IconNormal = Icon || BrushOutlined;
    const IconActive = IconWhenActive || Icon || Brush;

    return (
      <Tooltip title={tip || 'Рисовать на карте'}>
        <IconButton
          className={cnEditFeatureGeometryDraw()}
          onClick={this.handleClick}
          checked={mapStore.mode === MapMode.DRAW_FEATURE}
        >
          {mapStore.mode === MapMode.DRAW_FEATURE ? <IconActive /> : <IconNormal />}
        </IconButton>
      </Tooltip>
    );
  }

  @boundMethod
  private handleDraw(e: DrawEvent) {
    const { onDraw } = this.props;

    if (!projectionsStore.olProjection || !editFeatureStore.currentProjection) {
      services.logger.error('Не заданы текущая или ol-проекция, необходимые для трансформации координат');

      return;
    }

    const rawCoordinates = (e.feature as Feature<SimpleGeometry>).getGeometry()?.getCoordinates();
    const drawGeometryType: SingleDrawGeometryType = toDrawGeometry(editFeatureStore.geometryType);

    switch (drawGeometryType) {
      case GeometryType.POINT: {
        if (isCoordinate(rawCoordinates)) {
          mapDrawService.clearDraft();

          onDraw(transform(rawCoordinates, projectionsStore.olProjection, editFeatureStore.currentProjection));
        } else {
          services.logger.warn(
            `Координаты ${rawCoordinates?.toString()} не соответствуют типу геометрии ${drawGeometryType}`
          );
        }

        break;
      }
      case GeometryType.POLYGON:
      case GeometryType.MULTI_LINE_STRING: {
        if (isCoordinateArrayArray(rawCoordinates)) {
          onDraw(
            transformCoordinates(rawCoordinates, projectionsStore.olProjection, editFeatureStore.currentProjection)
          );
        } else {
          services.logger.warn(
            `Координаты ${rawCoordinates?.toString()} не соответствуют типу геометрии ${drawGeometryType}`
          );
        }
        break;
      }
    }
  }

  @boundMethod
  private handleClick() {
    if (!editFeatureStore.editFeaturesData?.features.length) {
      services.logger.error('Нет фичи для редактирования геометрии');

      return;
    }

    if (this.isDrawEnabled()) {
      mapDrawService.drawOff();
    } else {
      mapDrawService.drawOn(toDrawGeometry(editFeatureStore.geometryType));
    }
  }

  private isDrawEnabled(): boolean {
    return mapStore.mode === MapMode.DRAW_FEATURE;
  }
}
