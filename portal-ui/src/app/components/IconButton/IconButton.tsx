import React, { BaseHTMLAttributes, FC, ForwardedRef, forwardRef } from 'react';
import { CircularProgress, IconButton as BaseIconButton, IconButtonProps as BaseIconButtonProps } from '@mui/material';
import { cn } from '@bem-react/classname';

import { Link, LinkProps } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./IconButton.scss';

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
