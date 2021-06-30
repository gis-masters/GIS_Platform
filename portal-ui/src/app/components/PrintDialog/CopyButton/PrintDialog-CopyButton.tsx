import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { Fab, PropTypes } from '@material-ui/core';
import { FileCopyOutlined } from '@material-ui/icons';

import '!style-loader!css-loader!sass-loader!./PrintDialog-CopyButton.scss';

const cnPrintDialogCopyButton = cn('PrintDialog', 'CopyButton');

interface PrintDialogCopyButtonProps {
  onClick: () => void;
  color: PropTypes.Color;
  disabled: boolean;
}

export const PrintDialogCopyButton: FC<PrintDialogCopyButtonProps> = ({ color, disabled, onClick }) => (
  <Fab
    className={cnPrintDialogCopyButton({ disabled })}
    size='small'
    onClick={onClick}
    disabled={disabled}
    color={color}
  >
    <FileCopyOutlined />
  </Fab>
);
