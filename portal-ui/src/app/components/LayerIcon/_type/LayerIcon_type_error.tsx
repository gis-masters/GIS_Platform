import React from 'react';
import { Error } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { cnLayerIcon, type LayerIconProps } from '../LayerIcon.base';

export const withTypeError = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'error' },
  () =>
    ({ className, colorized, size }) => (
      <Error className={cnLayerIcon(null, [className])} fontSize={size} htmlColor={colorized ? '#dc3545' : ''} />
    )
);
