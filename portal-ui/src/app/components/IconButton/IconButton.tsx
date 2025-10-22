import React, { type BaseHTMLAttributes, type FC, type ForwardedRef, forwardRef } from 'react';
import {
  CircularProgress,
  IconButton as BaseIconButton,
  type IconButtonProps as BaseIconButtonProps
} from '@mui/material';
import { cn } from '@bem-react/classname';

import { Link, type LinkProps } from '../Link/Link';

import './IconButton.scss';

const cnIconButton = cn('IconButton');

export interface IconButtonProps
  extends BaseIconButtonProps,
    Partial<Pick<LinkProps, 'href' | 'download'>>,
    Omit<BaseHTMLAttributes<HTMLButtonElement>, 'color'> {
  loading?: boolean;
  checked?: boolean;
}

export const IconButton: FC<IconButtonProps> = forwardRef(
  ({ className, children, loading, checked, ...props }, ref: ForwardedRef<HTMLButtonElement>) => (
    <BaseIconButton
      {...(props.href ? { ...props, variant: 'none', LinkComponent: Link } : props)}
      className={cnIconButton({ loading, checked }, [className])}
      ref={ref}
    >
      {children}
      {loading && (
        <CircularProgress
          className={cnIconButton('Loader')}
          color='inherit'
          size={props.size === 'small' ? 28 : undefined}
        />
      )}
    </BaseIconButton>
  )
);
