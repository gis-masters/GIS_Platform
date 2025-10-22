import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './Layer-InnardsInner.scss';

const cnLayerInnardsInner = cn('Layer', 'InnardsInner');

export const LayerInnardsInner: FC<ChildrenProps> = ({ children }) => (
  <div className={cnLayerInnardsInner()}>{children}</div>
);
