import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { SchemaOutlined } from '@mui/icons-material';

import { IconButton } from '../../IconButton/IconButton';

interface SchemaDialogButtonProps {
  onOpen(): void;
}

export const SchemaDialogButton: FC<SchemaDialogButtonProps> = ({ onOpen }: SchemaDialogButtonProps) => {
  return (
    <Tooltip title={'Открыть схему'}>
      <IconButton onClick={onOpen}>
        <SchemaOutlined />
      </IconButton>
    </Tooltip>
  );
};
