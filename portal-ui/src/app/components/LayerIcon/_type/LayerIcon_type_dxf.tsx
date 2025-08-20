import React from 'react';
import { withBemMod } from '@bem-react/core';

import { Autocad } from '../../Icons/Autocad';
import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

export const withTypeDxf = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'dxf' },
  () =>
    ({ className, colorized, size }) => {
      return (
        <Autocad className={cnLayerIcon(null, [className])} fontSize={size} color={colorized ? 'primary' : 'inherit'} />
      );
    }
);
