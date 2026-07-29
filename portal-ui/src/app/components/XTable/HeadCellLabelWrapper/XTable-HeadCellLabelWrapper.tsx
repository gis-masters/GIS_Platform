import React, { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import './XTable-HeadCellLabelWrapper.scss';

const cnXTableHeadCellLabelWrapper = cn('XTable', 'HeadCellLabelWrapper');

interface XTableHeadCellLabelWrapperProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const XTableHeadCellLabelWrapper = forwardRef<HTMLSpanElement, XTableHeadCellLabelWrapperProps>(
  function XTableHeadCellLabelWrapper({ children, className, ...props }, ref) {
    return (
      <span ref={ref} className={cnXTableHeadCellLabelWrapper(null, [className])} {...props}>
        {children}
      </span>
    );
  }
);
