import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined, SquareFoot } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MapAction, MapMode } from '../../services/map/map.models';
import { MeasureMode } from '../../services/map/measure/map-measure.models';
import { mapMeasureService } from '../../services/map/measure/map-measure.service';
import { mapStore } from '../../stores/Map.store';
import { mapMeasureStore } from '../../stores/MapMeasure.store';
import { IconButton } from '../IconButton/IconButton';
import { Ruler } from '../Icons/Ruler';

import '!style-loader!css-loader!sass-loader!./MapMeasure.scss';
import '!style-loader!css-loader!sass-loader!../HelpMessage/HelpMessage.scss';

const cnMapMeasure = cn('MapMeasure');

@observer
export class MapMeasure extends Component {
  render() {
    const isMeasureActive = mapStore.mode === MapMode.MEASURE;

    return (
      <div className={cnMapMeasure()}>
        <Tooltip title='Измерить длину'>
          <IconButton
            onClick={this.handleLengthClick}
            checked={isMeasureActive && mapMeasureStore.measureMode === 'length'}
            size='small'
            disabled={!mapStore.allowedActions.includes(MapAction.MAP_MEASURE)}
          >
            <Ruler />
          </IconButton>
        </Tooltip>
        <Tooltip title='Измерить площадь'>
          <IconButton
            onClick={this.handleAreaClick}
            checked={isMeasureActive && mapMeasureStore.measureMode === 'area'}
            size='small'
            disabled={!mapStore.allowedActions.includes(MapAction.MAP_MEASURE)}
          >
            <SquareFoot />
          </IconButton>
        </Tooltip>
        {Boolean(mapMeasureStore.measureItems.length) && (
          <Tooltip title='Удалить все измерения'>
            <IconButton onClick={mapMeasureService.clearAll} size='small'>
              <DeleteSweepOutlined />
            </IconButton>
          </Tooltip>
        )}
      </div>
    );
  }

  @boundMethod
  private handleLengthClick() {
    this.selectMode('length');
  }

  @boundMethod
  private handleAreaClick() {
    this.selectMode('area');
  }

  private selectMode(mode?: MeasureMode) {
    mapMeasureService.removeHelpMsg();
    if (mode && mapMeasureStore.measureMode === mode) {
      mapMeasureService.measureOff();
    } else if (mode) {
      mapMeasureService.createMeasureStartTooltip();
      mapMeasureService.measureOn(mode);
    }

    if (mapStore.mode === MapMode.MEASURE && !mapMeasureStore.measureMode) {
      mapStore.setMode(MapMode.DEFAULT);
    }
  }
}
