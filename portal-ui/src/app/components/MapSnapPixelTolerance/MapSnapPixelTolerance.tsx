import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Divider, InputBase, Paper, Tooltip } from '@mui/material';
import { AnimationOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';
import { boundMethod } from 'autobind-decorator';

import { mapSnapStore } from '../../stores/MapSnap.store';

import '!style-loader!css-loader!sass-loader!./MapSnapPixelTolerance.scss';

const cnMapSnapPixelTolerance = cn('MapSnapPixelTolerance');

@observer
export class MapSnapPixelTolerance extends Component {
  render() {
    return (
      <>
        {mapSnapStore.isSnapToolActive() && (
          <Paper className={cnMapSnapPixelTolerance()} component='form'>
            <InputBase
              size='small'
              type='number'
              sx={{ ml: 1, flex: 1, opacity: 1 }}
              value={mapSnapStore.pixelTolerance}
              onChange={this.handleChange}
              inputProps={{
                step: 5
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
            <Tooltip title='Настройка чувствительности прилипания к объектам'>
              <AnimationOutlined className={cnMapSnapPixelTolerance('Icon')} />
            </Tooltip>
          </Paper>
        )}
      </>
    );
  }

  @boundMethod
  private handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    let value = Number(event.target.value);
    if (value < 1) {
      value = 99;
    } else if (value > 99) {
      value = 1;
    }

    mapSnapStore.setPixelTolerance(value);
  }
}
