import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Adjust } from '@material-ui/icons';
import GeometryType from 'ol/geom/GeometryType';

import { LayerIconProps, cnLayerIcon } from '../Layer-Icon';

export const withTypePoint = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: GeometryType.POINT },
  () => ({ className }) => <Adjust className={cnLayerIcon(null, [className])} />
);
