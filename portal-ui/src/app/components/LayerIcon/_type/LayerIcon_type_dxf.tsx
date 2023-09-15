import React from 'react';
import { withBemMod } from '@bem-react/core';

import { Autocad } from '../../Icons/Autocad';
import { LayerIconProps, cnLayerIcon } from '../LayerIcon';

export const withTypeDxf = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'dxf' },
  () =>
    ({ className, colorized }) => {
      return <Autocad className={cnLayerIcon(null, [className])} color={colorized ? 'primary' : 'inherit'} />;
    }
);
