import React from 'react';
import { withBemMod } from '@bem-react/core';

import { TypeTabPolygon } from '../../Icons/TypeTabPolygon';
import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

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
