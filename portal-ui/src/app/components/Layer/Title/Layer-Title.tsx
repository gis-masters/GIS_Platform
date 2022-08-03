import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Layer-Title.scss';

const cnLayerTitle = cn('Layer', 'Title');

interface LayerTitleProps extends ChildrenProps {
  isError: boolean;
}

export const LayerTitle: FC<LayerTitleProps> = ({ children, isError }) => (
  <div className={cnLayerTitle({ error: isError })}>{children}</div>
);
