import React, { CSSProperties, FC, RefObject } from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import { Paper } from '@mui/material';

import '!style-loader!css-loader!sass-loader!./XTable-Container.scss';

const cnXTableContainer = cn('XTable', 'Container');

interface XTableContainerProps extends IClassNameProps {
  containerRef: RefObject<HTMLDivElement>;
  minHeight: number;
}

export const XTableContainer: FC<XTableContainerProps> = ({ className, children, containerRef, minHeight }) => (
  <Paper
    className={cnXTableContainer(null, [className, 'scroll'])}
    square
    ref={containerRef}
    style={{ '--XTableTableMinHeight': minHeight } as CSSProperties}
  >
    {children}
  </Paper>
);
