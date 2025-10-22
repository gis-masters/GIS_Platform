import React, { type FC } from 'react';
import { Fab, type PropTypes } from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import './PrintMapDialog-CopyButton.scss';

const cnPrintMapDialogCopyButton = cn('PrintMapDialog', 'CopyButton');

interface PrintMapDialogCopyButtonProps {
  color: PropTypes.Color;
  disabled: boolean;
  onClick(): void;
}

export const PrintMapDialogCopyButton: FC<PrintMapDialogCopyButtonProps> = ({ color, disabled, onClick }) => (
  <Fab
    className={cnPrintMapDialogCopyButton({ disabled })}
    size='small'
    onClick={onClick}
    disabled={disabled}
    color={color}
  >
    <FileCopyOutlined />
  </Fab>
);
