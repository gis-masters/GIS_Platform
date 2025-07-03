import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { DeleteSweepOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryDelButton = cn('EditFeatureGeometry', 'DelButton');

interface EditFeatureGeometryDelButtonProps {
  onClick(): void;
  labelToDelete: string;
}

export const EditFeatureGeometryDelButton: FC<EditFeatureGeometryDelButtonProps> = ({ onClick, labelToDelete }) => (
  <Tooltip title={`Удалить ${labelToDelete}`}>
    <span>
      <IconButton className={cnEditFeatureGeometryDelButton()} onClick={onClick}>
        <DeleteSweepOutlined color='error' />
      </IconButton>
    </span>
  </Tooltip>
);
