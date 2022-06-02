import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { Tooltip } from '@mui/material';

import { IconButton } from '../../IconButton/IconButton';

import '!style-loader!css-loader!sass-loader!./XTable-FilterType.scss';

const cnXTableFilterType = cn('XTable', 'FilterType');

interface XTableContainerProps extends IClassNameProps {
  onClick: () => void;
  strictFiltering: boolean;
  filtered: boolean;
}

export const XTableFilterType: FC<XTableContainerProps> = ({ onClick, strictFiltering, filtered }) => (
  <Tooltip title={strictFiltering ? 'Строгое соответствие' : 'Поиск подстроки'}>
    <IconButton className={cnXTableFilterType({ filtered })} onClick={onClick} size='small'>
      {strictFiltering ? '=' : '≈'}
    </IconButton>
  </Tooltip>
);
