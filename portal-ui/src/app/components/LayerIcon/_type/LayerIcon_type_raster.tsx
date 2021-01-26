import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Texture } from '@material-ui/icons';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

export const withTypeRaster = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: 'raster' },
  () => ({ className }) => <Texture className={cnLayerIcon(null, [className])} />
);
