import React from 'react';
import { ErrorOutlined } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

export const withTypeError = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'error' },
  () =>
    ({ className, colorized, size }) => (
      <ErrorOutlined
        className={cnLayerIcon(null, [className])}
        fontSize={size}
        htmlColor={colorized ? '#dc3545' : ''}
      />
    )
);
