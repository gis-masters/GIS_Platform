import React from 'react';
import { cn } from '@bem-react/classname';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-AddButton.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAddButtonProps {
  onClick: () => void;
}

export const EditFeatureGeometryAddButton: React.FC<EditFeatureGeometryAddButtonProps> = ({ onClick, children }) => (
  <Button className={cnEditFeatureGeometry('AddButton')}
          color='primary'
          startIcon={<AddCircleOutlineIcon />}
          onClick={onClick}>
    {children}
  </Button>
);
