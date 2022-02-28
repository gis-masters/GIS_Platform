import React, { forwardRef, ReactNode } from 'react';
import { cn } from '@bem-react/classname';

import '!style-loader!css-loader!sass-loader!./Files-BaseName.scss';

const cnFilesBaseName = cn('Files', 'BaseName');

export const FilesBaseName = forwardRef<HTMLSpanElement, { children: ReactNode }>((props, ref) => (
  <span className={cnFilesBaseName()} ref={ref}>
    {props.children}
  </span>
));
