import React, { type CSSProperties, type FC, type RefObject } from 'react';
import { Paper, type PaperProps } from '@mui/material';
import { cn } from '@bem-react/classname';
import { type IClassNameProps } from '@bem-react/core';

import { type ChildrenProps } from '../../../services/models';

import './XTable-Container.scss';

const cnXTableContainer = cn('XTable', 'Container');

export interface XTableContainerProps extends IClassNameProps, ChildrenProps {
  containerRef: RefObject<HTMLDivElement>;
  minHeight: number;
  containerProps: Partial<PaperProps & XTableContainerProps>;
}

export const XTableContainer: FC<XTableContainerProps> = ({
  className,
  children,
  containerRef,
  minHeight,
  containerProps: {
    minHeight: minHeightFromContainerProps,
    className: classNameFromContainerProps,
    ...containerProps
  } = {}
}) => (
  <Paper
    className={cnXTableContainer(null, [className, classNameFromContainerProps, 'scroll'])}
    square
    ref={containerRef}
    style={{ '--XTableTableMinHeight': minHeightFromContainerProps || minHeight } as CSSProperties}
    {...containerProps}
  >
    {children}
  </Paper>
);
