import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { Brush, BrushOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { Emitter } from '../../../services/common/Emitter';
import { communicationService } from '../../../services/communication.service';
import { editFeatureStore } from '../../../services/map/a-map-mode/edit-feature/EditFeatureStore';
import { mapDrawService } from '../../../services/map/draw/map-draw.service';
import { toDrawGeometry } from '../../../services/map/draw/map-draw.util';
import { services } from '../../../services/services';
import { mapStore } from '../../../stores/Map.store';
import { mapLabelsStore } from '../../../stores/MapLabels.store';
import { IconButton } from '../../IconButton/IconButton';

import './EditFeatureGeometry-Draw.scss';

const cnEditFeatureGeometryDraw = cn('EditFeatureGeometry', 'Draw');

@observer
export class EditFeatureGeometryDraw extends Component {
  componentWillUnmount() {
    mapDrawService.drawOff();

    communicationService.off(this);
    Emitter.scopeOff(this);
  }

  render() {
    return (
      <div className={cnEditFeatureGeometryDraw()}>
        <Tooltip title='Редактировать геометрию'>
          <span>
            <IconButton onClick={this.handleClick} checked={mapStore.isDrawEnabled}>
              {mapStore.isDrawEnabled ? <Brush color='primary' /> : <BrushOutlined color='primary' />}
            </IconButton>
          </span>
        </Tooltip>
      </div>
    );
  }

  @boundMethod
  private handleClick() {
    if (!editFeatureStore.editFeaturesData?.features.length) {
      services.logger.error('Нет фичи для редактирования геометрии');

      return;
    }

    if (mapStore.isDrawEnabled) {
      mapDrawService.drawOff();
    } else {
      mapLabelsStore.setLabelsVisibility(false);
      void mapDrawService.drawOn(toDrawGeometry(editFeatureStore.geometryType));
    }
  }
}
