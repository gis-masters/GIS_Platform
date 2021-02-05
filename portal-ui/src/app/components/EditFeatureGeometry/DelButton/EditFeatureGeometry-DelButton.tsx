import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { DeleteSweepOutlined } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';

const cnEditFeatureGeometryDelButton = cn('EditFeatureGeometry', 'DelButton');

interface EditFeatureGeometryDelButtonProps {
  onClick: () => void;
  labelToDelete: string;
}

export const EditFeatureGeometryDelButton: FC<EditFeatureGeometryDelButtonProps> = ({ onClick, labelToDelete }) => (
  <Tooltip title={`Удалить ${labelToDelete}`}>
    <IconButton className={cnEditFeatureGeometryDelButton()} onClick={onClick}>
      <DeleteSweepOutlined />
    </IconButton>
  </Tooltip>
);
