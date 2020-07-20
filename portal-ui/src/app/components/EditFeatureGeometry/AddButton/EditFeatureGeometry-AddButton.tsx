import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { AddCircleOutline } from '@material-ui/icons';

import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-AddButton.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAddButtonProps {
  onClick: () => void;
}

export const EditFeatureGeometryAddButton: FC<EditFeatureGeometryAddButtonProps> = ({ onClick, children }) => (
  <Button
    className={cnEditFeatureGeometry('AddButton')}
    color='primary'
    startIcon={<AddCircleOutline />}
    onClick={onClick}
    variant='text'
  >
    {children}
  </Button>
);
