import React, { FC } from 'react';
import { cn } from '@bem-react/classname';

import { ChildrenProps } from '../../services/models';

import '!style-loader!css-loader!sass-loader!./ActionsRight.scss';

const cnActionsRight = cn('ActionsRight');

export const ActionsRight: FC<ChildrenProps> = ({ children }) => <div className={cnActionsRight()}>{children}</div>;
