import React, { FC } from 'react';
import { Minimize } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

const cnAttributesBarMinimize = cn('Attributes', 'BarMinimize');

interface AttributesBarMinimizeProps {
  onClick(): void;
}

export const AttributesBarMinimize: FC<AttributesBarMinimizeProps> = ({ onClick }) => (
  <IconButton className={cnAttributesBarMinimize()} onClick={onClick} size='small'>
    <Minimize fontSize='small' />
  </IconButton>
);
