import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { Button, type ButtonProps } from '../../Button/Button';

import './SelectFavoriteProjectionsControl-Button.scss';

const cnSelectFavoriteProjectionsControlButton = cn('SelectFavoriteProjectionsControl', 'Button');

export const SelectFavoriteProjectionsControlButton: FC<ButtonProps> = props => (
  <Button className={cnSelectFavoriteProjectionsControlButton()} {...props}>
    Выбрать систему координат
  </Button>
);
