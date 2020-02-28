import React from 'react';
import { cn } from '@bem-react/classname';
import { DeleteSweep } from '@material-ui/icons';
import { Tooltip, IconButton } from '@material-ui/core';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-DelButton.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryDelButtonProps {
  onClick: () => void;
}

export const EditFeatureGeometryDelButton: React.FC<EditFeatureGeometryDelButtonProps> = ({ onClick }) => (
  <Tooltip title='Удалить контур/линию'>
    <IconButton className={cnEditFeatureGeometry('DelButton')} onClick={onClick}>
      <DeleteSweep />
    </IconButton>
  </Tooltip>
);
