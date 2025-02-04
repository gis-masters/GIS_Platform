import React from 'react';
import { Texture } from '@mui/icons-material';
import { withBemMod } from '@bem-react/core';

import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

export const withTypeRaster = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'raster' },
  () =>
    ({ className, colorized, size }) => (
      <Texture className={cnLayerIcon(null, [className])} fontSize={size} color={colorized ? 'primary' : 'inherit'} />
    )
);
