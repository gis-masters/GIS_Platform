import React, { FC } from 'react';
import { cn } from '@bem-react/classname';
import { IconButtonProps as BaseIconButtonProps, IconButton as BaseIconButton, CircularProgress } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./IconButton.scss';

const cnIconButton = cn('IconButton');

interface IconButtonProps extends BaseIconButtonProps {
  loading?: boolean;
}

export const IconButton: FC<IconButtonProps> = ({ className, children, loading, ...props }) => (
  <BaseIconButton {...props} className={cnIconButton({ loading }, [className])}>
    {children}
    {loading && <CircularProgress className={cnIconButton('Loader')} color='inherit' />}
  </BaseIconButton>
);
