import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Layer-Title.scss';

const cnLayer = cn('Layer');

export const LayerTitle: FC = ({ children }) => (
  <div className={cnLayer('Title')}>
    {children}
  </div>
);
