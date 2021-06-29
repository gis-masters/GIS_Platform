import React from 'react';
import { withBemMod } from '@bem-react/core';
import { ErrorOutlined } from '@material-ui/icons';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

export const withTypeError = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'error' },
  () =>
    ({ className, colorized }) =>
      <ErrorOutlined className={cnLayerIcon(null, [className])} htmlColor={colorized ? '#dc3545' : ''} />
);
