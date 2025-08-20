import React, { FC } from 'react';
import { DragIndicator } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Drag.scss';

const cnLayerDrag = cn('Layer', 'Drag');

export const LayerDrag: FC = () => (
  <div className={cnLayerDrag()}>
    <DragIndicator color='primary' />
  </div>
);
