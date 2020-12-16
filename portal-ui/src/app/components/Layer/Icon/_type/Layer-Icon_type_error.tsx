import React from 'react';
import { withBemMod } from '@bem-react/core';
import { ErrorOutlined } from '@material-ui/icons';

import { LayerIconProps, cnLayerIcon } from '../Layer-Icon';

import '!style-loader!css-loader!sass-loader!./Layer-Icon_type_error.scss';

export const withTypeError = withBemMod<{}, LayerIconProps>(
  cnLayerIcon(),
  { type: 'error' },
  () => ({ className }) => <ErrorOutlined className={cnLayerIcon(null, [className])} />
);
