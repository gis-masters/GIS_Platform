import React, { type FC } from 'react';
import { cn } from '@bem-react/classname';

import { type ChildrenProps } from '../../services/models';

import './ActionsLeft.scss';

const cnActionsLeft = cn('ActionsLeft');

export const ActionsLeft: FC<ChildrenProps> = ({ children }) => <div className={cnActionsLeft()}>{children}</div>;
