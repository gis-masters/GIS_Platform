import React from 'react';
import { withBemMod } from '@bem-react/core';
import GeometryType from 'ol/geom/GeometryType';

import { Shape } from '../../../Icons/Shape';

import { LayerIconProps, cnLayerIcon } from '../Layer-Icon';

export const withTypeMultiPolygon = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: GeometryType.MULTI_POLYGON },
  () => ({ className }) => <Shape className={cnLayerIcon(null, [className])} />
);
