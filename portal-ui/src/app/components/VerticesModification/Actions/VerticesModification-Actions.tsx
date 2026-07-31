import React, { type FC, type PropsWithChildren } from 'react';
import { cn } from '@bem-react/classname';

import './VerticesModification-Actions.scss';

const cnVerticesModificationActions = cn('VerticesModification', 'Actions');
export const VerticesModificationActions: FC<PropsWithChildren> = ({ children }) => (
  <div className={cnVerticesModificationActions()}>{children}</div>
);
