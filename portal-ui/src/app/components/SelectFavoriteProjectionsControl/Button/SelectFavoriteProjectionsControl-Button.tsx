import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { Button, ButtonProps } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./SelectFavoriteProjectionsControl-Button.scss';

const cnSelectFavoriteProjectionsControlButton = cn('SelectFavoriteProjectionsControl', 'Button');

export const SelectFavoriteProjectionsControlButton: FC<ButtonProps> = props => (
  <Button className={cnSelectFavoriteProjectionsControlButton()} {...props}>
    Выбрать систему координат
  </Button>
);
