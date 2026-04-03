import React, { type FC } from 'react';
import { Tooltip } from '@mui/material';
import { Close } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

const cnPrintMapImageControlClear = cn('PrintMapImageControl', 'Clear');

export interface PrintMapImageControlClearProps {
  onClear: () => void;
}

export const PrintMapImageControlClear: FC<PrintMapImageControlClearProps> = ({ onClear }) => (
  <Tooltip title='Очистить'>
    <IconButton
      size='small'
      className={cnPrintMapImageControlClear()}
      onClick={onClear}
      aria-label='Очистить фрагмент карты'
    >
      <Close fontSize='small' />
    </IconButton>
  </Tooltip>
);
