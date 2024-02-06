import React from 'react';
import { withBemMod } from '@bem-react/core';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon.base';
import { TypeTabPolygon } from '../../Icons/TypeTabPolygon';

export const withTypeTab = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'tab' },
  () =>
    ({ className, colorized, size }) => {
      return (
        <TypeTabPolygon
          className={cnLayerIcon(null, [className])}
          fontSize={size}
          color={colorized ? 'primary' : 'inherit'}
        />
      );
    }
);
