import React from 'react';
import { withBemMod } from '@bem-react/core';

import { TypeMidPolygon } from '../../Icons/TypeMidPolygon';
import { cnLayerIcon, LayerIconProps } from '../LayerIcon.base';

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
