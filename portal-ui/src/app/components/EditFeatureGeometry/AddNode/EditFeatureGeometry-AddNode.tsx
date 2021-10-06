import React, { FC } from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';

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
