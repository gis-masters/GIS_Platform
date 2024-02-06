import React from 'react';
import { withBemMod } from '@bem-react/core';

import { LayerIconProps, cnLayerIcon } from '../LayerIcon.base';
import { TypeMidPolygon } from '../../Icons/TypeMidPolygon';

export const withTypeMid = withBemMod<LayerIconProps, LayerIconProps>(
  cnLayerIcon(),
  { type: 'mid' },
  () =>
    ({ className, colorized, size }) => {
      return (
        <TypeMidPolygon
          className={cnLayerIcon(null, [className])}
          fontSize={size}
          color={colorized ? 'primary' : 'inherit'}
        />
      );
    }
);
