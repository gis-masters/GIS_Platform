import React from 'react';
import { cn } from '@bem-react/classname';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-DelButton.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryDelButtonProps {
  onClick: () => void;
}

export const EditFeatureGeometryDelButton: React.FC<EditFeatureGeometryDelButtonProps> = ({ onClick, children }) => (
  <Button className={cnEditFeatureGeometry('DelButton')}
          startIcon={<DeleteSweepIcon />}
          onClick={onClick}>
    {children}
  </Button>
);
