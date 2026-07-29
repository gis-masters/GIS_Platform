import React from 'react';
import { withBemMod } from '@bem-react/core';

import { Nspd } from '../../Icons/Nspd';
import { cnLayerIcon, type LayerIconProps } from '../LayerIcon.base';

export const withTypeNspd = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'nspd' },
  () =>
    ({ className, colorized, size }) => (
      <Nspd className={cnLayerIcon(null, [className])} fontSize={size} color={colorized ? 'primary' : 'inherit'} />
    )
);
