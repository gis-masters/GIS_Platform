import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Close } from '@mui/icons-material';

import { IconButton } from '../../IconButton/IconButton';

const cnAttributesBarClose = cn('Attributes', 'BarClose');

interface AttributesBarCloseProps {
  onClick(): void;
}

export const AttributesBarClose: FC<AttributesBarCloseProps> = ({ onClick }) => (
  <IconButton className={cnAttributesBarClose()} onClick={onClick} size='small'>
    <Close fontSize='small' />
  </IconButton>
);
