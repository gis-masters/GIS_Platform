import React, { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

interface EditFeatureGeometryAddNodeProps {
  onClick: () => void;
}

export const EditFeatureGeometryAddNode: FC<EditFeatureGeometryAddNodeProps> = ({ onClick }) => (
  <Tooltip title='Добавить узел'>
    <IconButton onClick={onClick}>
      <AddCircleOutline />
    </IconButton>
  </Tooltip>
);
