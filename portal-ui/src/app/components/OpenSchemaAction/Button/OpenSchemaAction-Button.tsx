import React, { FC } from 'react';
import { Tooltip } from '@mui/material';
import { SchemaOutlined } from '@mui/icons-material';

import { IconButton } from '../../IconButton/IconButton';

interface OpenSchemaActionProps {
  onClick(): void;
}

export const OpenSchemaActionButton: FC<OpenSchemaActionProps> = ({ onClick }: OpenSchemaActionProps) => {
  return (
    <Tooltip title={'Открыть схему'}>
      <IconButton onClick={onClick}>
        <SchemaOutlined />
      </IconButton>
    </Tooltip>
  );
};
