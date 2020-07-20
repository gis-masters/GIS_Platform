import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { DeleteSweep } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';

const cnEditFeatureGeometryDelButton = cn('EditFeatureGeometry', 'DelButton');

interface EditFeatureGeometryDelButtonProps {
  onClick: () => void;
}

export const EditFeatureGeometryDelButton: FC<EditFeatureGeometryDelButtonProps> = ({ onClick }) => (
  <Tooltip title='Удалить контур/линию'>
    <IconButton className={cnEditFeatureGeometryDelButton()} onClick={onClick}>
      <DeleteSweep />
    </IconButton>
  </Tooltip>
);
