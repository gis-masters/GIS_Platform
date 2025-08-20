import React, { Component } from 'react';
import { action, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { cn } from '@bem-react/classname';

import { CoordinateAxesXY } from '../Icons/CoordinateAxesXY';
import { CoordinateAxesYX } from '../Icons/CoordinateAxesYX';

const cnCoordinateAxes = cn('CoordinateAxes');

interface CoordinateAxesProps {
  invertedCoordinates: boolean;
  onSelect(inverted: boolean): void;
}

@observer
export class CoordinateAxes extends Component<CoordinateAxesProps> {
  constructor(props: CoordinateAxesProps) {
    super(props);
    makeObservable(this);
  }

  render() {
    return (
      <Tooltip
        title='В GML файле могут содержаться координаты в разных системах. Если в результате импорта ориентация и
               расположение импортированных объектов на карте отличаются от ожидаемых — попробуйте разместить GML файл
               заново, выбрав другой режим с помощью этого переключателя.'
      >
        <ToggleButtonGroup
          className={cnCoordinateAxes()}
          size='small'
          value={this.props.invertedCoordinates ? 'xy' : 'yx'}
          exclusive
          onChange={this.handleCoordinatesInversionSwitcherChange}
        >
          <ToggleButton value='xy'>
            <Tooltip title='X — восток, Y — север (ENU)' placement='left'>
              <span>
                <CoordinateAxesXY fontSize='small' />
              </span>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value='yx'>
            <Tooltip title='X — север, Y — восток (NED)' placement='right'>
              <span>
                <CoordinateAxesYX fontSize='small' />
              </span>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Tooltip>
    );
  }

  @action.bound
  private handleCoordinatesInversionSwitcherChange(e: React.MouseEvent<HTMLElement, MouseEvent>, value: string) {
    this.props.onSelect(value === 'xy');
  }
}
