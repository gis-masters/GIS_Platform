import React, { type FC } from 'react';
import { observer } from 'mobx-react';
import { Tooltip } from '@mui/material';
import { DeleteSweepOutlined } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { IconButton } from '../../IconButton/IconButton';

const cnEditFeatureGeometryDelButton = cn('EditFeatureGeometry', 'DelButton');

interface EditFeatureGeometryDelButtonProps {
  onClick(): void;
  labelToDelete: string;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
}

export const EditFeatureGeometryDelButton: FC<EditFeatureGeometryDelButtonProps> = observer(
  ({ onClick, labelToDelete, onMouseEnter, onMouseLeave }) => (
    <Tooltip title={`Удалить ${labelToDelete}`}>
      <span>
        <IconButton
          className={cnEditFeatureGeometryDelButton()}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <DeleteSweepOutlined color={'error'} />
        </IconButton>
      </span>
    </Tooltip>
  )
);
