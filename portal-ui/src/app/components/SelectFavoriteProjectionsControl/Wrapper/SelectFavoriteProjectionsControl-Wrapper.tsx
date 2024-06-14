import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./SelectFavoriteProjectionsControl-Wrapper.scss';

const cnSelectFavoriteProjectionsControlWrapper = cn('SelectFavoriteProjectionsControl', 'Wrapper');

export const SelectFavoriteProjectionsControlWrapper: FC<ChildrenProps> = ({ children }) => (
  <div className={cnSelectFavoriteProjectionsControlWrapper()}>{children}</div>
);
