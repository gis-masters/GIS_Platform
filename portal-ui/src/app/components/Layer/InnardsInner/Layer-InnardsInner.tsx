import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Layer-InnardsInner.scss';

const cnLayerInnardsInner = cn('Layer', 'InnardsInner');

export const LayerInnardsInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayerInnardsInner()}>{children}</div>
);
