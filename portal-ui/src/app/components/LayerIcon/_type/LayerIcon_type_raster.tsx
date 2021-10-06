import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Texture } from '@mui/icons-material';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

export const withTypeRaster = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'raster' },
  () =>
    ({ className, colorized }) =>
      <Texture className={cnLayerIcon(null, [className])} color={colorized ? 'primary' : 'inherit'} />
);
