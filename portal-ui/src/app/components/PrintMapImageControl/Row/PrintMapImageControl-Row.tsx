import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../../services/models';

import './PrintMapImageControl-Row.scss';

const cnPrintMapImageControlRow = cn('PrintMapImageControl', 'Row');

export const PrintMapImageControlRow: FC<ChildrenProps> = ({ children }) => (
  <div className={cnPrintMapImageControlRow()}>{children}</div>
);
