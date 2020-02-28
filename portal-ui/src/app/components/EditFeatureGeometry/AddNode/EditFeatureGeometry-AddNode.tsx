import React, { FC } from 'react';
import { AddCircleOutline } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';

interface EditFeatureGeometryAddNodeProps {
  onClick: () => void;
}

export const EditFeatureGeometryAddNode: FC<EditFeatureGeometryAddNodeProps> = ({ onClick }) => (
  <Tooltip title='Добавить узел'>
    <IconButton color='primary' onClick={onClick}>
      <AddCircleOutline />
    </IconButton>
  </Tooltip>
);
