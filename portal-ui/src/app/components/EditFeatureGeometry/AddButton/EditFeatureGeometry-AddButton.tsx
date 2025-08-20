import React, { FC } from 'react';
import { AddCircleOutline } from '@mui/icons-material';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';
import { Button } from '../../Button/Button';

import '!style-loader!css-loader!sass-loader!./EditFeatureGeometry-AddButton.scss';

const cnEditFeatureGeometry = cn('EditFeatureGeometry');

interface EditFeatureGeometryAddButtonProps extends ChildrenProps {
  onClick(): void;
  disabled?: boolean;
}

export const EditFeatureGeometryAddButton: FC<EditFeatureGeometryAddButtonProps> = ({
  onClick,
  disabled,
  children
}) => (
  <Button
    className={cnEditFeatureGeometry('AddButton')}
    color='primary'
    startIcon={<AddCircleOutline />}
    onClick={onClick}
    variant='text'
    disabled={disabled}
  >
    {children}
  </Button>
);
