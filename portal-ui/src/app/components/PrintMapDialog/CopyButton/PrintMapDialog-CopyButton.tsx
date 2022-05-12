import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Fab, PropTypes } from '@mui/material';
import { FileCopyOutlined } from '@mui/icons-material';

import '!style-loader!css-loader!sass-loader!./PrintMapDialog-CopyButton.scss';

const cnPrintMapDialogCopyButton = cn('PrintMapDialog', 'CopyButton');

interface PrintMapDialogCopyButtonProps {
  onClick: () => void;
  color: PropTypes.Color;
  disabled: boolean;
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
