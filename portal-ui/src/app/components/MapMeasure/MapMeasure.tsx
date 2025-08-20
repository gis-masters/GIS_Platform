import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined, SquareFoot } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { MapAction, ToolMode } from '../../services/map/map.models';
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
    return (
      <div className={cnMapMeasure()}>
        <Tooltip title='Измерить длину'>
          <span>
            <IconButton
              onClick={this.handleLengthClick}
              checked={mapStore.toolMode === ToolMode.MEASURE_LENGTH}
              size='small'
              disabled={!mapStore.allowedActions.includes(MapAction.MAP_TOOL_MEASURE_LENGTH)}
            >
              <Ruler />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title='Измерить площадь'>
          <span>
            <IconButton
              onClick={this.handleAreaClick}
              checked={mapStore.toolMode === ToolMode.MEASURE_AREA}
              size='small'
              disabled={!mapStore.allowedActions.includes(MapAction.MAP_TOOL_MEASURE_AREA)}
            >
              <SquareFoot />
            </IconButton>
          </span>
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
  private handleMeasureClick(toolMode: ToolMode) {
    mapMeasureService.removeHelpMsg();

    const isActive = mapStore.toolMode === toolMode;
    if (isActive) {
      mapMeasureService.measureOff();
      mapStore.setToolMode(ToolMode.NONE);
    } else {
      mapMeasureService.createMeasureStartTooltip();
      mapMeasureService.measureOn(toolMode);
      mapStore.setToolMode(toolMode);
    }
  }

  @boundMethod
  private handleLengthClick() {
    this.handleMeasureClick(ToolMode.MEASURE_LENGTH);
  }

  @boundMethod
  private handleAreaClick() {
    this.handleMeasureClick(ToolMode.MEASURE_AREA);
  }
}
