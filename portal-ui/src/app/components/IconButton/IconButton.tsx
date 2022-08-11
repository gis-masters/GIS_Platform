import React, { BaseHTMLAttributes, FC, forwardRef, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { IconButtonProps as BaseIconButtonProps, IconButton as BaseIconButton, CircularProgress } from '@mui/material';

import { Link, LinkProps } from '../Link/Link';

import '!style-loader!css-loader!sass-loader!./IconButton.scss';

const cnIconButton = cn('IconButton');

export interface IconButtonProps
  extends BaseIconButtonProps,
    Partial<Pick<LinkProps, 'href' | 'download'>>,
    Omit<BaseHTMLAttributes<HTMLButtonElement>, 'color'> {
  loading?: boolean;
}

export const IconButton: FC<IconButtonProps> = forwardRef(
  ({ className, children, loading, ...props }, ref: RefObject<HTMLButtonElement>) => (
    <BaseIconButton
      {...(props.href ? { ...props, variant: 'none', LinkComponent: Link } : props)}
      className={cnIconButton({ loading }, [className])}
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
