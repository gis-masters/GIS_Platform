import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteSweepOutlined, SquareFoot } from '@mui/icons-material';
import { boundMethod } from 'autobind-decorator';
import { cn } from '@bem-react/classname';

import { MapModes, mapStore } from '../../stores/Map.store';
import { mapMeasureService, MeasureMode } from '../../services/map/map-measure.service';
import { Ruler } from '../Icons/Ruler';

import '!style-loader!css-loader!sass-loader!./MapMeasure.scss';

const cnMapMeasure = cn('MapMeasure');

@observer
export class MapMeasure extends Component {
  render() {
    const isMeasureActive = mapStore.mode === MapModes.MEASURE;

    return (
      <div className={cnMapMeasure()}>
        <Tooltip title='Измерить длину'>
          <IconButton
            onClick={this.handleLengthClick}
            size='small'
            color={isMeasureActive && mapStore.measureMode === 'length' ? 'secondary' : 'default'}
          >
            <Ruler />
          </IconButton>
        </Tooltip>
        <Tooltip title='Измерить площадь'>
          <IconButton
            onClick={this.handleAreaClick}
            size='small'
            color={isMeasureActive && mapStore.measureMode === 'area' ? 'secondary' : 'default'}
          >
            <SquareFoot />
          </IconButton>
        </Tooltip>
        {Boolean(mapStore.measureItems.length) && (
          <Tooltip title='Удалить все измерения'>
            <IconButton onClick={this.clearAll} size='small'>
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
    if (mode && mapStore.measureMode === mode) {
      mapMeasureService.measureOff();
    } else {
      mapMeasureService.measureOn(mode);
    }

    if (mapStore.mode === MapModes.MEASURE && !mapStore.measureMode) {
      mapStore.setMode(MapModes.DEFAULT);
    }
  }

  @boundMethod
  private clearAll() {
    mapMeasureService.clearAll();
  }
}
