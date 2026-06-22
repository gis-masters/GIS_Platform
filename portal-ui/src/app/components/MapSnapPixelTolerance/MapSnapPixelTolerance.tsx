import React, { type ChangeEvent, type FC } from 'react';
import { observer } from 'mobx-react';
import { Divider, InputBase, Paper, Tooltip } from '@mui/material';
import { AnimationOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { mapSnapStore } from '../../stores/MapSnap.store';

import './MapSnapPixelTolerance.scss';

const cnMapSnapPixelTolerance = cn('MapSnapPixelTolerance');

function handleChange(event: ChangeEvent<HTMLInputElement>) {
  let value = Number(event.target.value);
  if (value < 1) {
    value = 99;
  } else if (value > 99) {
    value = 1;
  }

  mapSnapStore.setPixelTolerance(value);
}

export const MapSnapPixelTolerance: FC = observer(() => {
  return (
    mapSnapStore.isSnapToolActive() && (
      <Paper className={cnMapSnapPixelTolerance()} component='form'>
        <InputBase
          size='small'
          type='number'
          sx={{ ml: 1, flex: 1, opacity: 1 }}
          value={mapSnapStore.pixelTolerance}
          onChange={handleChange}
          inputProps={{
            step: 5
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
        <Tooltip title='Настройка чувствительности прилипания к объектам'>
          <AnimationOutlined className={cnMapSnapPixelTolerance('Icon')} />
        </Tooltip>
      </Paper>
    )
  );
});
