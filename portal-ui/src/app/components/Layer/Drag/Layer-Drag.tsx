import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { DragIndicator } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./Layer-Drag.scss';

const cnLayerDrag = cn('Layer', 'Drag');

export const LayerDrag: FC = () => (
  <div className={cnLayerDrag()}>
    <DragIndicator color='primary' />
  </div>
);
