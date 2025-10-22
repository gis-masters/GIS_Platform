import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './SelectFavoriteProjectionsControl-Wrapper.scss';

const cnSelectFavoriteProjectionsControlWrapper = cn('SelectFavoriteProjectionsControl', 'Wrapper');

export const SelectFavoriteProjectionsControlWrapper: FC<ChildrenProps> = ({ children }) => (
  <div className={cnSelectFavoriteProjectionsControlWrapper()}>{children}</div>
);
