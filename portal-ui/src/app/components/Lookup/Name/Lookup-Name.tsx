import React, { BaseHTMLAttributes, FC, ForwardedRef } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import '!style-loader!css-loader!sass-loader!./Lookup-Name.scss';

const cnLookupName = cn('Lookup', 'Name');

interface LookupNameProps extends IClassNameProps, BaseHTMLAttributes<HTMLDivElement> {
  numerous: boolean;
}

export const LookupName: FC<LookupNameProps> = React.forwardRef(
  ({ className, numerous, children, ...otherProps }, ref: ForwardedRef<HTMLDivElement>) => (
    <span className={cnLookupName({ numerous }, [className])} ref={ref} {...otherProps}>
      {children}
    </span>
  )
);
