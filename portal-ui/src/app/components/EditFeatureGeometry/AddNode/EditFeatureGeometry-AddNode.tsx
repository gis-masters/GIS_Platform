import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { IconButton, Tooltip } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

const cnEditFeatureGeometryAddNode = cn('EditFeatureGeometry', 'AddNode');

interface EditFeatureGeometryAddNodeProps {
  onClick(): void;
}

export const EditFeatureGeometryAddNode: FC<EditFeatureGeometryAddNodeProps> = observer(({ onClick }) => (
  <Tooltip title='Добавить вершину'>
    <span>
      <IconButton className={cnEditFeatureGeometryAddNode()} onClick={onClick} color='primary'>
        <AddCircleOutline />
      </IconButton>
    </span>
  </Tooltip>
));
