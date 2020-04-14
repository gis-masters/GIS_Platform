import React from 'react';
import { withBemMod } from '@bem-react/core';
import { Category } from '@material-ui/icons';

import { LayerIconProps, cnLayerIcon } from '../Layer-Icon';

export const withTypeUnknown = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: 'unknown' },
  () => ({ className }) => <Category className={cnLayerIcon(null, [className])} />
);
