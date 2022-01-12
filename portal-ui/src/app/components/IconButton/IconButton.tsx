import React, { FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { IconButtonProps as BaseIconButtonProps, IconButton as BaseIconButton, CircularProgress } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./IconButton.scss';

const cnIconButton = cn('IconButton');

export interface IconButtonProps extends BaseIconButtonProps {
  loading?: boolean;
  buttonRef?: RefObject<HTMLButtonElement>;
}

export const IconButton: FC<IconButtonProps> = ({ className, children, loading, buttonRef, ...props }) => (
  <BaseIconButton {...props} className={cnIconButton({ loading }, [className])} ref={buttonRef}>
    {children}
    {loading && <CircularProgress className={cnIconButton('Loader')} color='inherit' />}
  </BaseIconButton>
);
