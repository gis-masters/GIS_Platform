import React, { type BaseHTMLAttributes, type FC, type ForwardedRef, forwardRef } from 'react';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import './Lookup-Name.scss';

const cnLookupName = cn('Lookup', 'Name');

interface LookupNameProps extends IClassNameProps, BaseHTMLAttributes<HTMLDivElement> {
  numerous: boolean;
}

export const LookupName: FC<LookupNameProps> = forwardRef(
  ({ className, numerous, children, ...otherProps }, ref: ForwardedRef<HTMLDivElement>) => (
    <span className={cnLookupName({ numerous }, [className])} ref={ref} {...otherProps}>
      {children}
    </span>
  )
);
