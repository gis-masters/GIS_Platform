import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./ActionsLeft.scss';

const cnActionsLeft = cn('ActionsLeft');

export const ActionsLeft: FC<ChildrenProps> = ({ children }) => <div className={cnActionsLeft()}>{children}</div>;
