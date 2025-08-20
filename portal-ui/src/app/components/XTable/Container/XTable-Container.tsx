import React, { CSSProperties, FC, RefObject } from 'react';
import { Paper, PaperProps } from '@mui/material';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./XTable-Container.scss';

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
