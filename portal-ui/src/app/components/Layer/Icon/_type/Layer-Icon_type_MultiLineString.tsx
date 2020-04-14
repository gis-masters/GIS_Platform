import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Timeline } from '@material-ui/icons';
import GeometryType from 'ol/geom/GeometryType';

import { LayerIconProps, cnLayerIcon } from '../Layer-Icon';

export const withTypeMultiLineString = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: GeometryType.MULTI_LINE_STRING },
  () => ({ className }) => <Timeline className={cnLayerIcon(null, [className])} />
);
