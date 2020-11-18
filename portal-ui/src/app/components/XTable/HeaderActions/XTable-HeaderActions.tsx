import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

const cnXTableHeaderActions = cn('XTable', 'HeaderActions');

export const XTableHeaderActions: FC = ({ children }) => <div className={cnXTableHeaderActions()}>{children}</div>;
