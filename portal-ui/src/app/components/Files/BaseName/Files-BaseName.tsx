import React, { forwardRef } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../../services/models';

import '!style-loader!css-loader!sass-loader!./Files-BaseName.scss';

const cnFilesBaseName = cn('Files', 'BaseName');

export const FilesBaseName = forwardRef<HTMLSpanElement, ChildrenProps>((props, ref) => (
  <span className={cnFilesBaseName()} ref={ref}>
    {props.children}
  </span>
));
