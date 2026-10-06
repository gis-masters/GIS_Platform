import React, { type FC } from 'react';
import { Fab } from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

const cnPrintMapDialogCopyButton = cn('PrintMapDialog', 'CopyButton');

interface PrintMapDialogCopyButtonProps {
  onClick(): void;
}

export const PrintMapDialogCopyButton: FC<PrintMapDialogCopyButtonProps> = ({ onClick }) => (
  <Fab className={cnPrintMapDialogCopyButton()} size='small' onClick={onClick}>
    <FileCopyOutlined />
  </Fab>
);
