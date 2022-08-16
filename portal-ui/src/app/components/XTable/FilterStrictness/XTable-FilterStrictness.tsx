import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { Tooltip } from '@mui/material';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./XTable-FilterStrictness.scss';

const cnXTableFilterStrictness = cn('XTable', 'FilterStrictness');

interface XTableFilterStrictnessProps extends IClassNameProps {
  onClick: () => void;
  strict: boolean;
  filtered: boolean;
}

export const XTableFilterStrictness: FC<XTableFilterStrictnessProps> = ({ onClick, strict, filtered }) => (
  <Tooltip title={strict ? 'Строгое соответствие' : 'Поиск подстроки'}>
    <IconButton className={cnXTableFilterStrictness({ filtered, strict })} onClick={onClick} size='small'>
      {strict ? '=' : '≈'}
    </IconButton>
  </Tooltip>
);
