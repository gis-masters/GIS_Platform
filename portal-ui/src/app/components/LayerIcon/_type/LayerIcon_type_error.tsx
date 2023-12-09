import React from 'react';
import { withBemMod } from '@bem-react/core';
import { ErrorOutlined } from '@mui/icons-material';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

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
